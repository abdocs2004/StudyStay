import db from '../config/db.js';

const buildPostsQuery = (queryParams) => {
  const {
    search,
    university,
    city,
    min_budget,
    max_budget,
    rooms,
    bathrooms,
    min_area,
    max_area,
    sort,
    status,
  } = queryParams;

  let query = `
    SELECT po.*, 
           u.name as student_name, 
           u.email as student_email, 
           u.phone as student_phone,
           u.university as student_university,
           p.title as property_title,
           p.city as property_city
    FROM posts po
    JOIN users u ON po.student_id = u.id
    LEFT JOIN properties p ON po.property_id = p.id
    WHERE 1 = 1
  `;
  const params = [];

  if (status && status.trim() !== '') {
    query += ' AND po.status = ?';
    params.push(status);
  } else {
    query += " AND po.status = 'active'";
  }

  query += " AND po.approval_status = 'approved'";

  if (university && university.trim() !== '') {
    query += ' AND po.university LIKE ?';
    params.push(`%${university}%`);
  }

  if (city && city.trim() !== '') {
    query += ' AND po.city LIKE ?';
    params.push(`%${city}%`);
  }

  if (min_budget) {
    query += ' AND po.budget >= ?';
    params.push(parseFloat(min_budget));
  }

  if (max_budget) {
    query += ' AND po.budget <= ?';
    params.push(parseFloat(max_budget));
  }

  if (rooms) {
    query += ' AND po.rooms = ?';
    params.push(parseInt(rooms));
  }

  if (bathrooms) {
    query += ' AND po.bathrooms = ?';
    params.push(parseInt(bathrooms));
  }

  if (min_area) {
    query += ' AND po.area >= ?';
    params.push(parseInt(min_area));
  }

  if (max_area) {
    query += ' AND po.area <= ?';
    params.push(parseInt(max_area));
  }

  if (search && search.trim() !== '') {
    query += ' AND (po.description LIKE ? OR u.name LIKE ? OR po.preferred_area LIKE ? OR po.city LIKE ? OR po.university LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  let orderClause = ' ORDER BY po.created_at DESC';
  switch (sort) {
    case 'oldest':
      orderClause = ' ORDER BY po.created_at ASC';
      break;
    case 'newest':
    default:
      orderClause = ' ORDER BY po.created_at DESC';
      break;
  }

  query += orderClause;
  return { query, params };
};

// @desc    Create a new student housing request (post)
// @route   POST /api/posts
// @access  Private (Student / Admin)
export const createPost = async (req, res) => {
  const { role, id: studentId } = req.user;
  const {
    university,
    city,
    preferred_area,
    budget,
    rooms,
    bathrooms,
    area,
    description,
    property_id,
  } = req.body;

  if (role !== 'student' && role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، الطلاب فقط يمكنهم نشر طلب سكن' });
  }

  if (!university || !city || !budget || !rooms || !bathrooms || !area || !description) {
    return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة' });
  }

  const cleanedDescription = description.trim();
  if (cleanedDescription === '') {
    return res.status(400).json({ message: 'الرجاء كتابة وصف الطلب' });
  }

  const numericBudget = parseFloat(budget);
  const numericRooms = parseInt(rooms, 10);
  const numericBathrooms = parseInt(bathrooms, 10);
  const numericArea = parseInt(area, 10);

  if (Number.isNaN(numericBudget) || Number.isNaN(numericRooms) || Number.isNaN(numericBathrooms) || Number.isNaN(numericArea)) {
    return res.status(400).json({ message: 'الرجاء إدخال قيم رقمية صحيحة في الحقول المناسبة' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO posts (student_id, property_id, university, city, preferred_area, budget, rooms, bathrooms, area, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        studentId,
        property_id || null,
        university,
        city,
        preferred_area || null,
        numericBudget,
        numericRooms,
        numericBathrooms,
        numericArea,
        cleanedDescription,
      ]
    );

    return res.status(201).json({
      message: 'تم نشر الطلب بنجاح',
      postId: result.insertId,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء نشر الطلب' });
  }
};

// @desc    Get all student requests/posts (for Owners home feed)
// @route   GET /api/posts
// @access  Private (Owner / Admin)
export const getPosts = async (req, res) => {
  if (req.user.role !== 'owner' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'غير مصرح، فقط الملاك يمكنهم مشاهدة الطلبات' });
  }

  const { query, params } = buildPostsQuery(req.query);

  try {
    const [rows] = await db.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب منشورات الطلاب' });
  }
};

// @desc    Get a specific student request/post
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT po.*, 
             u.name as student_name, 
             u.email as student_email, 
             u.phone as student_phone,
             u.university as student_university,
             p.title as property_title,
             p.city as property_city
      FROM posts po
      JOIN users u ON po.student_id = u.id
      LEFT JOIN properties p ON po.property_id = p.id
      WHERE po.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    const post = rows[0];
    if (role === 'student' && post.student_id !== userId) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    return res.json(post);
  } catch (error) {
    console.error('Error fetching post details:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب تفاصيل الطلب' });
  }
};

// @desc    Update a student request/post
// @route   PUT /api/posts/:id
// @access  Private (Student / Admin)
export const updatePost = async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;
  const {
    university,
    city,
    preferred_area,
    budget,
    rooms,
    bathrooms,
    area,
    description,
    property_id,
    status,
  } = req.body;

  try {
    const [existingRows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    const post = existingRows[0];
    if (role === 'student' && post.student_id !== userId) {
      return res.status(403).json({ message: 'غير مصرح، لا يمكنك تعديل هذا الطلب' });
    }

    const updates = [];
    const params = [];

    if (university !== undefined) {
      updates.push('university = ?');
      params.push(university);
    }
    if (city !== undefined) {
      updates.push('city = ?');
      params.push(city);
    }
    if (preferred_area !== undefined) {
      updates.push('preferred_area = ?');
      params.push(preferred_area);
    }
    if (budget !== undefined) {
      const numericBudget = parseFloat(budget);
      if (Number.isNaN(numericBudget)) {
        return res.status(400).json({ message: 'الرجاء إدخال ميزانية صحيحة' });
      }
      updates.push('budget = ?');
      params.push(numericBudget);
    }
    if (rooms !== undefined) {
      const numericRooms = parseInt(rooms, 10);
      if (Number.isNaN(numericRooms)) {
        return res.status(400).json({ message: 'الرجاء إدخال عدد غرف صحيح' });
      }
      updates.push('rooms = ?');
      params.push(numericRooms);
    }
    if (bathrooms !== undefined) {
      const numericBathrooms = parseInt(bathrooms, 10);
      if (Number.isNaN(numericBathrooms)) {
        return res.status(400).json({ message: 'الرجاء إدخال عدد حمامات صحيح' });
      }
      updates.push('bathrooms = ?');
      params.push(numericBathrooms);
    }
    if (area !== undefined) {
      const numericArea = parseInt(area, 10);
      if (Number.isNaN(numericArea)) {
        return res.status(400).json({ message: 'الرجاء إدخال مساحة صحيحة' });
      }
      updates.push('area = ?');
      params.push(numericArea);
    }
    if (description !== undefined) {
      if (description.trim() === '') {
        return res.status(400).json({ message: 'الرجاء كتابة وصف الطلب' });
      }
      updates.push('description = ?');
      params.push(description.trim());
    }
    if (property_id !== undefined) {
      updates.push('property_id = ?');
      params.push(property_id || null);
    }
    if (status !== undefined) {
      if (!['active', 'closed'].includes(status)) {
        return res.status(400).json({ message: 'حالة الطلب غير صحيحة' });
      }
      updates.push('status = ?');
      params.push(status);
    }

    // A non-admin student editing a rejected request is implicitly
    // resubmitting it for approval.
    if (role !== 'admin' && post.approval_status === 'rejected') {
      updates.push('approval_status = ?');
      params.push('pending');
      updates.push('rejection_reason = NULL');
    }

    if (updates.length > 0) {
      params.push(id);
      await db.query(`UPDATE posts SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    return res.json({ message: 'تم تحديث الطلب بنجاح' });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث الطلب' });
  }
};

// @desc    Delete a student request/post
// @route   DELETE /api/posts/:id
// @access  Private (Student / Admin)
export const deletePost = async (req, res) => {
  const { role, id: userId } = req.user;
  const { id } = req.params;

  try {
    const [existingRows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'الطلب غير موجود' });
    }

    const post = existingRows[0];
    if (role === 'student' && post.student_id !== userId) {
      return res.status(403).json({ message: 'غير مصرح، لا يمكنك حذف هذا الطلب' });
    }

    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    return res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء حذف الطلب' });
  }
};

// @desc    Get current student's requests/posts
// @route   GET /api/posts/student/me
// @access  Private (Student)
export const getStudentPosts = async (req, res) => {
  const { id: studentId } = req.user;

  try {
    const [rows] = await db.query(`
      SELECT po.*, p.title as property_title, p.city as property_city
      FROM posts po
      LEFT JOIN properties p ON po.property_id = p.id
      WHERE po.student_id = ?
      ORDER BY po.created_at DESC
    `, [studentId]);
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching student posts:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب طلباتك السكنية' });
  }
};
