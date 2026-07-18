# TODO - حُجرة Frontend

## Phase 1: Routing + Auth scaffolding
- [ ] فهم/تحديث `useAuth.ts` لتخزين `user` و `role`
- [ ] تحديث `ProtectedRoute.tsx` لدعم `role` و`isAuthenticated`
- [ ] إنشاء صفحات:
  - [ ] `src/features/dashboard/pages/StudentHome.tsx`
  - [ ] `src/features/dashboard/pages/OwnerHome.tsx`
- [ ] تحديث `src/routes/AppRoutes.tsx`:
  - [ ] إضافة `/home` للطالب
  - [ ] إضافة `/owner/home` للمالك
  - [ ] توجيه `/dashboard` (إن لزم) للـ StudentHome

## Phase 2: UI for Profile + Posts (Frontend mock)
- [ ] مكوّن Top-Left Profile (ينطبق على الطالب والمالك)
- [ ] mock posts flow:
  - [ ] إضافة بوست من StudentHome
  - [ ] عرض feed بوستات الطالب داخل OwnerHome/Property feed

## Phase 3: Chat wiring
- [ ] تعديل `ChatPage.tsx` لدعم `studentId` / `threadId`
- [ ] ربط زر “مراسلة الطالب” بالـ chat

## Phase 4: Backend integration
- [ ] استبدال mock services بـ API calls حقيقية
- [ ] ربط posts/property/chat endpoints

