export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  active: boolean;
  createdAt: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  imageUrl?: string;
  active: boolean;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  color?: string;
  size?: string;
  weight?: number;
  dimensions?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  timestamp: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  userId: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface InventoryResponse {
  id: number;
  productId: number;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  warehouseLocation: string;
  reorderLevel: number;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
}
