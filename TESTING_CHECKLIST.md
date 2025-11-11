# Admin Module - Testing Checklist

## Pre-Testing Setup

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Frontend development server is running (`npm run dev`)
- [ ] MongoDB is running and accessible
- [ ] Environment variables are correctly set (VITE_API_BASE_URL)
- [ ] User is logged in as an admin account

## Admin Dashboard Tests

### Loading & Display
- [ ] Dashboard loads without errors
- [ ] Stats cards display correct numbers
  - [ ] Total Doctors shows correct count
  - [ ] Active Doctors shows correct count
  - [ ] Total Patients shows correct count
  - [ ] Today's Appointments shows correct count
- [ ] All cards have proper loading skeleton while fetching
- [ ] Error message appears if API fails

### Navigation
- [ ] "Manage Doctors" link navigates to doctor management
- [ ] "Manage Patients" link navigates to patient management
- [ ] "View Appointments" link navigates to appointments
- [ ] Back button works if implemented

## Manage Doctors Tests

### Viewing & Filtering
- [ ] Doctor list loads and displays all doctors
- [ ] Each doctor shows:
  - [ ] Profile image (or placeholder)
  - [ ] Name
  - [ ] Email
  - [ ] Specialization
  - [ ] Room number
  - [ ] Status badge (Active/Inactive)
- [ ] Search bar works:
  - [ ] Filter by doctor name (case-insensitive)
  - [ ] Filter by specialization
- [ ] Filter buttons work:
  - [ ] "All" shows all doctors
  - [ ] "Active" shows only active doctors
  - [ ] "Inactive" shows only inactive doctors
- [ ] Empty state shows when no doctors match filters

### Adding Doctor
- [ ] "Add Doctor" button opens modal
- [ ] Modal form has all required fields:
  - [ ] Name
  - [ ] Email
  - [ ] Password
  - [ ] Specialization
  - [ ] License Number
  - [ ] Experience
  - [ ] Consultation Fee
  - [ ] Room Number
  - [ ] Profile Image
- [ ] Image preview works when image is selected
- [ ] Form validation:
  - [ ] Required fields show error if empty
  - [ ] Email validation works
  - [ ] Numbers have proper validation
- [ ] File upload works:
  - [ ] Only image files accepted (or proper error message)
  - [ ] Image size limit enforced if set
- [ ] Submit button:
  - [ ] Shows loading state
  - [ ] Disables during submission
- [ ] Success toast notification appears after adding
- [ ] New doctor appears in list immediately (or after refresh)
- [ ] Modal closes after successful submission

### Deleting Doctor
- [ ] Delete button appears on each doctor
- [ ] Confirmation dialog appears before deletion
- [ ] Delete is successful:
  - [ ] Doctor removed from list
  - [ ] Success toast appears
  - [ ] Stats card updates
- [ ] Error handling:
  - [ ] Error toast appears if delete fails
  - [ ] Doctor remains in list if error

### Updating Doctor Status
- [ ] Status toggle button appears
- [ ] Toggle changes status:
  - [ ] From Active to Inactive (or vice versa)
  - [ ] API call is made
  - [ ] Success toast appears
- [ ] Optional: Edit button prepared for future use

## Manage Patients Tests

### Viewing & Filtering
- [ ] Patient list loads and displays all patients
- [ ] Each patient shows:
  - [ ] Patient name
  - [ ] Email
  - [ ] Phone
  - [ ] Date of Birth / Age
  - [ ] Status badge
- [ ] Search bar works:
  - [ ] Filter by patient name
  - [ ] Filter by email
- [ ] Filter buttons work:
  - [ ] "All" shows all patients
  - [ ] "Active" shows only active
  - [ ] "Inactive" shows only inactive
- [ ] Empty state shows when no matches

### Patient Details Modal
- [ ] Click on patient opens details modal
- [ ] Modal displays:
  - [ ] Personal information (name, email, phone, DOB)
  - [ ] Medical information (blood group, allergies)
  - [ ] Emergency contact info
  - [ ] Account status
  - [ ] Registration date
- [ ] Modal closes when clicking outside or close button

### Patient Status Update
- [ ] Status toggle button works
- [ ] Changes patient status:
  - [ ] Active to Inactive
  - [ ] Reflects in API immediately
  - [ ] Toast notification appears

### Pagination (if implemented)
- [ ] Pagination controls appear if more than 10 patients
- [ ] Page navigation works
- [ ] Correct patients shown per page

## Manage Appointments Tests

### Viewing & Filtering
- [ ] Appointment list loads and displays all appointments
- [ ] Each appointment shows:
  - [ ] Patient name
  - [ ] Doctor name
  - [ ] Appointment date & time
  - [ ] Appointment type/reason
  - [ ] Status badge (color-coded)
  - [ ] Action buttons
- [ ] Search bar works:
  - [ ] Filter by patient name
  - [ ] Filter by doctor name
- [ ] Filter buttons work:
  - [ ] "All" shows all appointments
  - [ ] "Scheduled" shows only scheduled
  - [ ] "Completed" shows only completed
  - [ ] "Cancelled" shows only cancelled
- [ ] Date filter (if implemented):
  - [ ] Filter by today's appointments
  - [ ] Filter by date range

### Status Updates
- [ ] "Mark as Completed" button:
  - [ ] Changes status to completed
  - [ ] Status badge color changes to green
  - [ ] Toast notification appears
  - [ ] Data persists on refresh
- [ ] "Cancel Appointment" button:
  - [ ] Shows confirmation dialog
  - [ ] Changes status to cancelled
  - [ ] Status badge color changes to red
  - [ ] Toast notification appears

### Optional Details
- [ ] Click appointment shows:
  - [ ] Full patient details
  - [ ] Full doctor details
  - [ ] Complete appointment notes
  - [ ] Medical history (if available)

## Error Handling Tests

### Network Errors
- [ ] Disconnect from internet/backend
- [ ] Error message appears (not a blank screen)
- [ ] "Retry" button appears and works when reconnected

### Validation Errors
- [ ] Submit doctor form without required fields
  - [ ] Form validation errors appear
  - [ ] Request not sent to backend
- [ ] Submit invalid email
  - [ ] Email validation error appears
- [ ] Submit with invalid file
  - [ ] File validation error appears

### Server Errors
- [ ] Backend returns 404 - shows appropriate error
- [ ] Backend returns 500 - shows error message
- [ ] Backend returns validation error - shows user-friendly message
- [ ] Timeout/slow response - loading state persists

## Performance Tests

- [ ] List loads quickly (< 2 seconds for typical data)
- [ ] Search/filter results appear quickly (< 500ms)
- [ ] Modal opens smoothly
- [ ] No memory leaks (check DevTools Memory)
- [ ] No console errors or warnings

## Responsive Design Tests

### Mobile (320px+)
- [ ] Layout stacks vertically
- [ ] Search bar works
- [ ] Buttons are tappable (40px+ height)
- [ ] Modals are readable
- [ ] Tables become scrollable or convert to card layout

### Tablet (768px+)
- [ ] Two-column layout where appropriate
- [ ] All content visible without excessive scrolling
- [ ] Modal sizing is appropriate

### Desktop (1024px+)
- [ ] Full layout displays properly
- [ ] Tables show all columns
- [ ] Proper spacing and alignment

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Tests

- [ ] Tab navigation works through all interactive elements
- [ ] Buttons have :focus states
- [ ] Error messages are color-blind friendly
- [ ] Images have alt text
- [ ] Form labels are associated with inputs
- [ ] Status badges have text labels (not color-only)

## Authentication & Authorization

- [ ] Only admin users can access admin pages
- [ ] Non-admin users redirected to home
- [ ] Session expires properly
- [ ] Logout clears admin state

## Data Consistency Tests

- [ ] Add doctor, then refresh - doctor still present
- [ ] Delete doctor, refresh - doctor still gone
- [ ] Update status, wait, refresh - status persists
- [ ] Stats cards match actual data count

## Final Verification Checklist

### Functionality
- [ ] All CRUD operations work
- [ ] All filters and searches work
- [ ] All error states handled
- [ ] All success messages appear

### User Experience
- [ ] Loading states clear and informative
- [ ] Error messages helpful and actionable
- [ ] Success feedback immediate and clear
- [ ] Navigation intuitive

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] No broken links
- [ ] No typos in UI

### Performance
- [ ] Pages load quickly
- [ ] No lag or jank
- [ ] API calls efficient
- [ ] No unnecessary re-renders

### Documentation
- [ ] README updated if needed
- [ ] Code comments clear
- [ ] API responses documented

---

## Bug Report Template

When issues are found:

```
**Title**: [Concise issue description]

**Component**: [Which component/page]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]

**Actual Result**: [What actually happened]

**Error Message**: [If any]

**Browser/Device**: [Where it occurs]

**Severity**: [Critical/High/Medium/Low]

**Screenshot/Video**: [If applicable]
```

---

**Checklist Version**: 1.0
**Last Updated**: November 10, 2025
**Total Tests**: 100+
