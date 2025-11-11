# Admin Module - API Integration Guide

## RTK Query Setup Pattern

### Admin API Service Structure

```javascript
// src/store/services/Admin.js
export const AdminApi = createApi({
  reducerPath: "AdminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/admin`,
    credentials: "include", // Important: Sends cookies for auth
  }),
  tagTypes: ["Doctors", "Patients", "Appointments", "AdminData"],
  endpoints: (builder) => ({
    // Mutations (POST, PUT, DELETE)
    // Queries (GET)
  }),
});

export const {
  useCreateDoctorMutation,
  useGetAllDoctorsQuery,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  // ... other hooks
} = AdminApi;
```

## FormData Handling Pattern

### For File Uploads (Create Doctor)

```javascript
// In component
const [createDoctor] = useCreateDoctorMutation();

const handleAddDoctor = async (newDoctorData) => {
  try {
    const formData = new FormData();
    
    // Append all fields
    formData.append('name', newDoctorData.name);
    formData.append('email', newDoctorData.email);
    // ... other fields
    
    // Append file with correct field name (matches backend multer config)
    if (newDoctorData.profileImage) {
      formData.append('profileImage', newDoctorData.profileImage);
    }

    const res = await createDoctor(formData).unwrap();
    toast.success('Doctor added successfully!');
  } catch (error) {
    toast.error(error?.data?.message || 'Error adding doctor');
  }
};
```

## Component Pattern

### Search & Filter Component Pattern

```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filter, setFilter] = useState('all');

// Fetch data
const { data, isLoading, error } = useGetAllDoctorsQuery();
const doctors = data?.data?.doctors || [];

// Filter locally
const filteredDoctors = doctors.filter(doctor => {
  const matchesSearch = doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesFilter = filter === 'all' || doctor.userId?.isActive === (filter === 'active');
  
  return matchesSearch && matchesFilter;
});

// Render with optional chaining
{filteredDoctors.map(doctor => (
  <div key={doctor._id}>
    <h3>{doctor.userId?.name}</h3>
    {/* Content */}
  </div>
))}
```

### CRUD Operations Pattern

```javascript
// Create
const [createItem] = useCreateItemMutation();
await createItem(formData).unwrap();

// Read (via Query - automatic caching)
const { data } = useGetAllItemsQuery();

// Update
const [updateItem] = useUpdateItemMutation();
await updateItem({ id: itemId, data: newData }).unwrap();

// Delete
const [deleteItem] = useDeleteItemMutation();
await deleteItem(itemId).unwrap();
```

## Error Handling Pattern

```javascript
try {
  const response = await mutation(data).unwrap();
  toast.success('Success message');
  // Handle success
} catch (error) {
  // Error structure from backend
  const errorMessage = error?.data?.message || error?.error || 'Something went wrong';
  toast.error(errorMessage);
  console.error('Detailed error:', error);
}
```

## Loading State Pattern

```javascript
if (isLoading) {
  return <div className="animate-pulse">Loading...</div>;
}

if (error) {
  return <div className="text-red-500">Error loading data</div>;
}

// Render component
```

## Modal Component Pattern

```javascript
const AddItemModal = ({ isOpen, onClose }) => {
  const [preview, setPreview] = useState(null);
  const [createItem, { isLoading }] = useCreateItemMutation();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      // ... append data
      await createItem(formData).unwrap();
      reset();
      onClose();
    } catch (error) {
      // Handle error
    }
  };

  if (!isOpen) return null;

  return <modal>{/* Modal content */}</modal>;
};
```

## Backend API Response Expected Format

```javascript
// Success Response
{
  success: true,
  message: "Operation successful",
  data: {
    doctors: [], // or doctors, patients, appointments
    total: 10
  }
}

// Error Response
{
  success: false,
  message: "Error description",
  error: "Error details"
}
```

## Tailwind Component Patterns

### Stats Cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="bg-white rounded-lg shadow p-4 text-center">
    <div className="text-2xl font-bold text-blue-600 mb-1">{stat}</div>
    <div className="text-gray-600 text-sm">Label</div>
  </div>
</div>
```

### Search & Filter Bar
```jsx
<div className="bg-white rounded-lg shadow p-4 mb-6">
  <div className="flex flex-col md:flex-row gap-4">
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="flex flex-wrap gap-2">
      {/* Filter buttons */}
    </div>
  </div>
</div>
```

### List Item with Actions
```jsx
<div className="divide-y divide-gray-200">
  {items.map(item => (
    <div key={item._id} className="p-6 hover:bg-gray-50 transition">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          {/* Item info */}
        </div>
        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
          {/* Action buttons */}
        </div>
      </div>
    </div>
  ))}
</div>
```

## Status Badge Pattern

```jsx
<span className={`px-2 py-1 rounded-full text-xs font-medium ${
  status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}`}>
  {status === 'active' ? 'Active' : 'Inactive'}
</span>
```

## Toast Notification Pattern

```javascript
import toast from 'react-hot-toast';

// Success
toast.success('Operation successful!');

// Error
toast.error('Error occurred');

// Loading
toast.loading('Processing...');

// Custom
toast((t) => (
  <div>Custom content</div>
), { duration: 3000 });
```

## TypeScript Response Types (Optional)

```typescript
interface Doctor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    experience: number;
    consultationFee: number;
    isActive: boolean;
  };
  roomNumber: string;
  maxPatientsPerDay: number;
  isAvailable: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

## Testing Tips

1. **Check Network Tab**: Verify API calls are being made correctly
2. **Verify Response Structure**: Ensure backend returns expected format
3. **Test Error Cases**: Test network failures and validation errors
4. **Test Loading States**: Verify loading indicators appear
5. **Test Optimistic Updates**: Check if RTK invalidates cache properly
6. **Check Console**: Look for error messages and warnings

---

**Pattern Version**: 1.0
**Last Updated**: November 10, 2025
