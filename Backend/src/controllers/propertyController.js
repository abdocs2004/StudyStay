import multer from 'multer';
import db from '../config/db.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('يجب أن تكون كل الصور من نوع JPEG أو PNG أو WEBP'));
    }
    cb(null, true);
  },
});

const MIN_PROPERTY_IMAGES = 3;
const MAX_PROPERTY_IMAGES = 7;

const parseFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features;
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildSearchQuery = (queryParams) => {
  const {
    search,
    university,
    city,
    min_rent,
    max_rent,
    rooms,
    bathrooms,
    min_area,
    max_area,
    availability,
    type,
    sort,
  } = queryParams;

  let query = `
    SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone,
           IFNULL((SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY id LIMIT 1), p.image) as main_image
    FROM properties p
    JOIN users u ON p.owner_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (university && university.trim() !== '') {
    query += ' AND p.nearby_university LIKE ?';
    params.push(`%${university}%`);
  }

  if (city && city.trim() !== '') {
    query += ' AND p.city LIKE ?';
    params.push(`%${city}%`);
  }

  if (min_rent) {
    query += ' AND p.rent >= ?';
    params.push(parseFloat(min_rent));
  }

  if (max_rent) {
    query += ' AND p.rent <= ?';
    params.push(parseFloat(max_rent));
  }

  if (rooms && rooms !== '') {
    query += ' AND p.rooms = ?';
    params.push(parseInt(rooms));
  }

  if (bathrooms && bathrooms !== '') {
    query += ' AND p.bathrooms = ?';
    params.push(parseInt(bathrooms));
  }

  if (min_area) {
    query += ' AND p.size >= ?';
    params.push(parseInt(min_area));
  }

  if (max_area) {
    query += ' AND p.size <= ?';
    params.push(parseInt(max_area));
  }

  if (availability && availability.trim() !== '') {
    query += ' AND p.occupancy = ?';
    params.push(availability);
  }

  if (type && type.trim() !== '') {
    query += ' AND p.type = ?';
    params.push(type);
  }

  if (search && search.trim() !== '') {
    query += ' AND (p.title LIKE ? OR p.description LIKE ? OR p.city LIKE ? OR p.address LIKE ? OR p.nearby_university LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  let orderClause = ' ORDER BY p.created_at DESC';
  switch (sort) {
    case 'price_asc':
      orderClause = ' ORDER BY p.rent ASC';
      break;
    case 'price_desc':
      orderClause = ' ORDER BY p.rent DESC';
      break;
    case 'area_asc':
      orderClause = ' ORDER BY p.size ASC';
      break;
    case 'area_desc':
      orderClause = ' ORDER BY p.size DESC';
      break;
    case 'rooms_asc':
      orderClause = ' ORDER BY p.rooms ASC';
      break;
    case 'rooms_desc':
      orderClause = ' ORDER BY p.rooms DESC';
      break;
    case 'newest':
      orderClause = ' ORDER BY p.created_at DESC';
      break;
    case 'oldest':
      orderClause = ' ORDER BY p.created_at ASC';
      break;
    default:
      break;
  }

  query += orderClause;
  return { query, params };
};

const getPropertyImages = async (propertyId) => {
  const [imageRows] = await db.query('SELECT image_url FROM property_images WHERE property_id = ? ORDER BY id ASC', [propertyId]);
  return imageRows.map((row) => row.image_url);
};

const getPropertyImageRows = async (propertyId) => {
  const [rows] = await db.query(
    'SELECT id, image_url, public_id FROM property_images WHERE property_id = ? ORDER BY id ASC',
    [propertyId]
  );
  return rows;
};

const insertPropertyImages = async (propertyId, images) => {
  if (!Array.isArray(images)) {
    return;
  }

  const validImages = images.filter((url) => typeof url === 'string' && url.trim() !== '');
  if (validImages.length === 0) {
    return;
  }

  const placeholders = validImages.map(() => '(?, ?)').join(', ');
  const values = validImages.flatMap((url) => [propertyId, url]);
  await db.query(`INSERT INTO property_images (property_id, image_url) VALUES ${placeholders}`, values);
};

// @desc    Get all properties (with filtering)
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  const { query, params } = buildSearchQuery(req.query);
  const isAdmin = req.user && req.user.role === 'admin';

  // Students/guests must only ever see approved properties. Admins previewing
  // the public listing (e.g. via the search page) see everything.
  const finalQuery = isAdmin ? query : query.replace('WHERE 1=1', "WHERE p.approval_status = 'approved'");

  try {
    const [rows] = await db.query(finalQuery, params);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب العقارات' });
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone 
       FROM properties p 
       JOIN users u ON p.owner_id = u.id 
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'العقار غير موجود' });
    }

    const property = rows[0];

    const isOwner = req.user && req.user.id === property.owner_id;
    const isAdmin = req.user && req.user.role === 'admin';
    if (property.approval_status !== 'approved' && !isOwner && !isAdmin) {
      return res.status(404).json({ message: 'العقار غير موجود' });
    }

    const images = await getPropertyImages(property.id);
    property.images = images.length > 0 ? images : property.image ? [property.image] : [];
    property.main_image = images.length > 0 ? images[0] : property.image;
    property.features = parseFeatures(property.features);

    // Fire-and-forget view counter — only counts visits from people other
    // than the owner previewing their own listing.
    if (!isOwner) {
      db.query('UPDATE properties SET views = views + 1 WHERE id = ?', [property.id]).catch((viewError) =>
        console.error('Error incrementing property views:', viewError)
      );
    }

    return res.json(property);
  } catch (error) {
    console.error('Error fetching property details:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب تفاصيل العقار' });
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner / Admin)
export const createProperty = async (req, res) => {
  const { role, id: ownerId } = req.user;

  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، أصحاب العقارات فقط يمكنهم إضافة عقار' });
  }

  const {
    title,
    description,
    city,
    address,
    nearby_university,
    rent,
    rooms,
    bathrooms,
    halls,
    size,
    type,
    image,
    latitude,
    longitude,
    occupancy,
    images,
    features,
  } = req.body;

  if (!title || !description || !city || !address || !nearby_university || !rent) {
    return res.status(400).json({ message: 'الرجاء إدخال الحقول الأساسية المطلوبة' });
  }

  const propertyImage = image || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';
  const featuresJson = Array.isArray(features) ? JSON.stringify(features) : null;

  try {
    const [result] = await db.query(
      `INSERT INTO properties 
       (owner_id, title, description, city, address, nearby_university, rent, rooms, bathrooms, halls, size, type, occupancy, image, latitude, longitude, features) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ownerId,
        title,
        description,
        city,
        address,
        nearby_university,
        parseFloat(rent),
        parseInt(rooms) || 1,
        parseInt(bathrooms) || 1,
        parseInt(halls) || 0,
        parseInt(size) || 0,
        type || 'شقة كاملة',
        occupancy || 'متاح',
        propertyImage,
        latitude || null,
        longitude || null,
        featuresJson,
      ]
    );

    if (images && Array.isArray(images) && images.length > 0) {
      await insertPropertyImages(result.insertId, images);
    }

    return res.status(201).json({
      message: 'تم إضافة العقار بنجاح',
      propertyId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء إضافة العقار' });
  }
};

// @desc    Update a property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner / Admin)
export const updateProperty = async (req, res) => {
  const { role, id: ownerId } = req.user;
  const { id } = req.params;

  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، أصحاب العقارات فقط يمكنهم تعديل العقار' });
  }

  const {
    title,
    description,
    city,
    address,
    nearby_university,
    rent,
    rooms,
    bathrooms,
    halls,
    size,
    type,
    image,
    latitude,
    longitude,
    occupancy,
    images,
    features,
  } = req.body;

  try {
    const [existingRows] = await db.query('SELECT * FROM properties WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'العقار غير موجود' });
    }

    const property = existingRows[0];
    if (property.owner_id !== ownerId && role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح، لا يمكنك تعديل هذا العقار' });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (city !== undefined) {
      updates.push('city = ?');
      params.push(city);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      params.push(address);
    }
    if (nearby_university !== undefined) {
      updates.push('nearby_university = ?');
      params.push(nearby_university);
    }
    if (rent !== undefined) {
      updates.push('rent = ?');
      params.push(parseFloat(rent));
    }
    if (rooms !== undefined) {
      updates.push('rooms = ?');
      params.push(parseInt(rooms) || 1);
    }
    if (bathrooms !== undefined) {
      updates.push('bathrooms = ?');
      params.push(parseInt(bathrooms) || 1);
    }
    if (halls !== undefined) {
      updates.push('halls = ?');
      params.push(parseInt(halls) || 0);
    }
    if (size !== undefined) {
      updates.push('size = ?');
      params.push(parseInt(size) || 0);
    }
    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }
    if (occupancy !== undefined) {
      updates.push('occupancy = ?');
      params.push(occupancy);
    }
    if (image !== undefined) {
      updates.push('image = ?');
      params.push(image || property.image);
    }
    if (latitude !== undefined) {
      updates.push('latitude = ?');
      params.push(latitude || null);
    }
    if (longitude !== undefined) {
      updates.push('longitude = ?');
      params.push(longitude || null);
    }
    if (features !== undefined) {
      updates.push('features = ?');
      params.push(Array.isArray(features) ? JSON.stringify(features) : null);
    }

    // A non-admin owner editing a rejected property is implicitly
    // resubmitting it for approval.
    if (role !== 'admin' && property.approval_status === 'rejected') {
      updates.push('approval_status = ?');
      params.push('pending');
      updates.push('rejection_reason = NULL');
    }

    if (updates.length > 0) {
      params.push(id);
      await db.query(`UPDATE properties SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    if (images && Array.isArray(images)) {
      await db.query('DELETE FROM property_images WHERE property_id = ?', [id]);
      await insertPropertyImages(id, images);
    }

    return res.json({ message: 'تم تحديث بيانات العقار بنجاح' });
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث العقار' });
  }
};

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner / Admin)
export const deleteProperty = async (req, res) => {
  const { role, id: ownerId } = req.user;
  const { id } = req.params;

  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، أصحاب العقارات فقط يمكنهم حذف العقار' });
  }

  try {
    const [existingRows] = await db.query('SELECT * FROM properties WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'العقار غير موجود' });
    }

    const property = existingRows[0];
    if (property.owner_id !== ownerId && role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح، لا يمكنك حذف هذا العقار' });
    }

    await db.query('DELETE FROM property_images WHERE property_id = ?', [id]);
    await db.query('DELETE FROM properties WHERE id = ?', [id]);

    return res.json({ message: 'تم حذف العقار بنجاح' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حذف العقار' });
  }
};

// @desc    Upload one or more images (Cloudinary) for a property the owner owns
// @route   POST /api/properties/:id/images
// @access  Private (Owner / Admin)
export const uploadPropertyImages = async (req, res) => {
  const uploadMultiple = upload.array('images', MAX_PROPERTY_IMAGES);

  uploadMultiple(req, res, async (err) => {
    if (err) {
      console.error('Property image upload error:', err);
      return res.status(400).json({ message: err.message || 'حدث خطأ أثناء رفع الصور' });
    }

    const { role, id: userId } = req.user;
    const { id: propertyId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'الرجاء رفع صورة واحدة على الأقل' });
    }

    try {
      const [propertyRows] = await db.query('SELECT owner_id FROM properties WHERE id = ?', [propertyId]);
      if (propertyRows.length === 0) {
        return res.status(404).json({ message: 'العقار غير موجود' });
      }
      if (propertyRows[0].owner_id !== userId && role !== 'admin') {
        return res.status(403).json({ message: 'غير مصرح، لا يمكنك تعديل صور هذا العقار' });
      }

      const existingImages = await getPropertyImageRows(propertyId);
      const totalAfterUpload = existingImages.length + req.files.length;

      if (totalAfterUpload > MAX_PROPERTY_IMAGES) {
        return res.status(400).json({
          message: `الحد الأقصى ${MAX_PROPERTY_IMAGES} صور لكل عقار (يوجد حالياً ${existingImages.length})`,
        });
      }

      const uploaded = await Promise.all(
        req.files.map((file) => uploadBufferToCloudinary(file.buffer, 'properties'))
      );

      const placeholders = uploaded.map(() => '(?, ?, ?)').join(', ');
      const values = uploaded.flatMap(({ url, publicId }) => [propertyId, url, publicId]);
      await db.query(`INSERT INTO property_images (property_id, image_url, public_id) VALUES ${placeholders}`, values);

      const updatedImages = await getPropertyImageRows(propertyId);

      if (totalAfterUpload < MIN_PROPERTY_IMAGES) {
        return res.status(200).json({
          message: `تم الرفع، لكن يجب أن يحتوي العقار على ${MIN_PROPERTY_IMAGES} صور على الأقل (${totalAfterUpload}/${MIN_PROPERTY_IMAGES})`,
          images: updatedImages,
        });
      }

      return res.status(201).json({ message: 'تم رفع الصور بنجاح', images: updatedImages });
    } catch (error) {
      console.error('Error uploading property images:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء رفع الصور' });
    }
  });
};

// @desc    Delete a single property image
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Private (Owner / Admin)
export const deletePropertyImage = async (req, res) => {
  const { role, id: userId } = req.user;
  const { id: propertyId, imageId } = req.params;

  try {
    const [propertyRows] = await db.query('SELECT owner_id FROM properties WHERE id = ?', [propertyId]);
    if (propertyRows.length === 0) {
      return res.status(404).json({ message: 'العقار غير موجود' });
    }
    if (propertyRows[0].owner_id !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح، لا يمكنك تعديل صور هذا العقار' });
    }

    const existingImages = await getPropertyImageRows(propertyId);
    if (existingImages.length <= MIN_PROPERTY_IMAGES) {
      return res.status(400).json({
        message: `يجب أن يحتوي العقار على ${MIN_PROPERTY_IMAGES} صور على الأقل. أضف صوراً بديلة قبل الحذف.`,
      });
    }

    const target = existingImages.find((row) => row.id === Number(imageId));
    if (!target) {
      return res.status(404).json({ message: 'الصورة غير موجودة' });
    }

    await db.query('DELETE FROM property_images WHERE id = ?', [imageId]);
    await deleteFromCloudinary(target.public_id);

    const updatedImages = await getPropertyImageRows(propertyId);
    return res.json({ message: 'تم حذف الصورة', images: updatedImages });
  } catch (error) {
    console.error('Error deleting property image:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حذف الصورة' });
  }
};

// @desc    Aggregate stats for the owner dashboard
// @route   GET /api/properties/owner/stats
// @access  Private (Owner)
export const getOwnerStats = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const [[propertyCounts]] = await db.query(
      `SELECT
        COUNT(*) AS total,
        SUM(approval_status = 'approved') AS approved,
        SUM(approval_status = 'pending') AS pending,
        SUM(approval_status = 'rejected') AS rejected,
        COALESCE(SUM(views), 0) AS total_views
      FROM properties WHERE owner_id = ?`,
      [ownerId]
    );

    const [[favoritesCount]] = await db.query(
      `SELECT COUNT(*) AS total_favorites FROM favorites f
       JOIN properties p ON f.property_id = p.id
       WHERE p.owner_id = ?`,
      [ownerId]
    );

    const [[messagesCount]] = await db.query(
      'SELECT COUNT(*) AS total_messages FROM messages WHERE sender_id = ? OR receiver_id = ?',
      [ownerId, ownerId]
    );

    const [[reviewStats]] = await db.query(
      'SELECT COUNT(*) AS total_reviews, COALESCE(AVG(rating), 0) AS average_rating FROM reviews WHERE owner_id = ?',
      [ownerId]
    );

    return res.json({
      properties: propertyCounts,
      favorites: favoritesCount,
      messages: messagesCount,
      reviews: { total_reviews: reviewStats.total_reviews, average_rating: Math.round(reviewStats.average_rating * 10) / 10 },
    });
  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب إحصائيات المالك' });
  }
};

// @desc    Get current owner's properties
// @route   GET /api/properties/owner/me
// @access  Private (Owner / Admin)
export const getOwnerProperties = async (req, res) => {
  const { role, id: ownerId } = req.user;

  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، أصحاب العقارات فقط' });
  }

  try {
    const [rows] = await db.query(
      `SELECT p.*, IFNULL((SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY id LIMIT 1), p.image) as main_image
       FROM properties p
       WHERE p.owner_id = ?
       ORDER BY p.created_at DESC`,
      [ownerId]
    );
    const withParsedFeatures = rows.map((row) => ({ ...row, features: parseFeatures(row.features) }));
    return res.json(withParsedFeatures);
  } catch (error) {
    console.error('Error fetching owner properties:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب عقارات المالك' });
  }
};
