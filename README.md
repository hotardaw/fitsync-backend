# fitsync-backend

Add RPE/percentage functionality
Add role-based exercise verification (admin only)

Line 88-89 of exerciseController.js:
Only allow "Admin" role to update "verified" property

Line ~98ish of exerciseControlelr.js:
Only allow original author of exercise to delete exercise, and prevent verified exercises from being deleted
