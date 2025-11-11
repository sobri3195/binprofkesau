# Quick Login Bypass Feature

## Overview
Fitur bypass login dengan klik langsung yang memungkinkan developer dan tester untuk masuk dengan cepat tanpa perlu mengetik email dan password.

## Fitur Utama

### ✨ Quick Login Buttons
Setiap akun demo memiliki tombol tersendiri dengan:
- **Visual yang menarik**: Icon, warna berbeda per role
- **Hover effect**: Border dan background color berubah saat hover
- **Disabled state**: Tombol disabled saat loading
- **Smooth transition**: Animasi transisi yang smooth

### 🎯 Demo Accounts

1. **👑 Super Admin**
   - Email: `superadmin@binprofkes.mil.id`
   - Password: `admin123`
   - Role: SuperAdmin
   - Access: Full permissions

2. **🏢 Admin Satuan**
   - Email: `admin.halim@binprofkes.mil.id`
   - Password: `admin123`
   - Role: AdminSatuan
   - Satuan: Lanud Halim Perdanakusuma

3. **⚙️ Operator**
   - Email: `operator@binprofkes.mil.id`
   - Password: `operator123`
   - Role: Operator
   - Access: Operator Kesehatan

4. **👁️ Viewer**
   - Email: `viewer@binprofkes.mil.id`
   - Password: `viewer123`
   - Role: Viewer
   - Access: View-only dashboard

5. **⚡ Bypass Account** (Highlighted)
   - Email: `bypass@binprofkes.mil.id`
   - Password: `bypass123`
   - Role: SuperAdmin
   - Tujuan: Quick testing access

## Cara Penggunaan

### 1. Buka Halaman Login
Navigasi ke halaman login aplikasi.

### 2. Pilih Akun
Scroll ke bawah form login untuk melihat section "🔐 Quick Login - Klik untuk masuk".

### 3. Klik Tombol
Klik salah satu tombol akun untuk langsung login dengan akun tersebut.

### 4. Otomatis Masuk
Sistem akan:
- Memanggil fungsi `handleQuickLogin()` dengan kredensial yang sudah ditentukan
- Melakukan autentikasi melalui `authStore.login()`
- Menyimpan data user ke localStorage (key: `binprofkes:currentUser`)
- Mencatat aktivitas login ke audit log
- Redirect ke dashboard (`/app/dashboard`)

## Implementasi Teknis

### File yang Dimodifikasi
- `/src/pages/Login.tsx`

### Fungsi Utama

```typescript
const handleQuickLogin = async (demoEmail: string, demoPassword: string) => {
  setError('');
  setLoading(true);

  const success = await login(demoEmail, demoPassword);

  if (success) {
    navigate('/app/dashboard');
  } else {
    setError('Login gagal');
  }

  setLoading(false);
};
```

### Data Storage
Data user disimpan di localStorage dengan:
- **Key**: `binprofkes:currentUser`
- **Format**: JSON object dengan struktur User interface
- **Service**: `StorageService` dari `@/services/storage`

### Authentication Flow
1. Klik tombol Quick Login
2. `handleQuickLogin()` dipanggil dengan email & password
3. `authStore.login()` memverifikasi kredensial dari localStorage
4. User ditemukan → Update lastLoginAt → Simpan ke localStorage
5. Set state `isAuthenticated = true`
6. Log aktivitas ke `AuditService`
7. Navigate ke dashboard

## UI/UX Design

### Button States
- **Normal**: Border abu-abu, background putih
- **Hover**: Border warna role, background warna role (opacity rendah)
- **Active/Click**: Background lebih gelap
- **Disabled**: Opacity 50%, cursor not-allowed

### Color Coding
- **Super Admin**: Primary color (default theme)
- **Admin Satuan**: Blue (`blue-500`)
- **Operator**: Green (`green-500`)
- **Viewer**: Purple (`purple-500`)
- **Bypass**: Orange (`orange-500`) dengan border lebih tebal

### Responsive Design
- Full width buttons
- Spacing konsisten (space-y-2)
- Padding comfortable (p-3)
- Text size responsif

## Security Notes

⚠️ **PENTING**: Fitur ini hanya untuk development dan testing!

- **Jangan gunakan di production** tanpa additional security
- Password hardcoded untuk kemudahan development
- Data disimpan di localStorage (tidak encrypted)
- Ideal untuk:
  - Local development
  - Demo purposes
  - Testing berbagai roles
  - Quick prototype testing

## Benefits

✅ **Kecepatan**: Login dalam 1 klik tanpa typing  
✅ **Efisiensi**: Testing multi-role lebih cepat  
✅ **User-friendly**: Visual yang jelas per role  
✅ **Developer-friendly**: Tidak perlu ingat password  
✅ **Testing**: Mudah switch antar roles  

## Future Improvements

Potensial enhancement:
- [ ] Tambah keyboard shortcut (1-5) untuk quick login
- [ ] Add "Remember last login" preference
- [ ] Show role capabilities/permissions preview
- [ ] Add custom account creator (temporary accounts)
- [ ] Integration dengan environment variables untuk disable di production
- [ ] Add session timeout indicator

## Troubleshooting

### Tombol tidak berfungsi
- Check console untuk error
- Pastikan localStorage tidak penuh
- Verify seed data sudah ter-load

### Login gagal
- Clear localStorage: `localStorage.clear()`
- Reload page untuk re-seed data
- Check `StorageService` dan `authStore`

### Redirect tidak bekerja
- Verify route `/app/dashboard` exists
- Check React Router configuration
- Ensure navigation guard tidak blocking

---

**Created**: December 2024  
**Version**: 1.0.0  
**Author**: Development Team
