import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Create 2 suppliers
  const supplier1 = await prisma.user.upsert({
    where: { email: 'supplier1@example.com' },
    update: {},
    create: {
      name: 'Fresh Farms Produce',
      email: 'supplier1@example.com',
      password,
      role: Role.SUPPLIER,
    },
  });

  const supplier2 = await prisma.user.upsert({
    where: { email: 'supplier2@example.com' },
    update: {},
    create: {
      name: 'Ocean Catch Seafood',
      email: 'supplier2@example.com',
      password,
      role: Role.SUPPLIER,
    },
  });

  // Create 1 restaurant
  const restaurant1 = await prisma.user.upsert({
    where: { email: 'restaurant@example.com' },
    update: {},
    create: {
      name: 'The Golden Fork',
      email: 'restaurant@example.com',
      password,
      role: Role.RESTAURANT,
    },
  });

  // Create 10 products
  const productsData = [
    { name: 'Organic Tomatoes', description: 'Freshly picked organic tomatoes', price: 2.5, stock: 100, supplierId: supplier1.id, imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
    { name: 'Red Onions', description: 'Crisp red onions', price: 1.2, stock: 200, supplierId: supplier1.id, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500' },
    { name: 'Avocados', description: 'Ripe Hass avocados', price: 3.0, stock: 50, supplierId: supplier1.id, imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500' },
    { name: 'Bell Peppers', description: 'Mixed color bell peppers', price: 2.0, stock: 150, supplierId: supplier1.id, imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500' },
    { name: 'Spinach', description: 'Fresh baby spinach', price: 4.5, stock: 80, supplierId: supplier1.id, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500' },
    
    { name: 'Atlantic Salmon', description: 'Fresh Atlantic Salmon fillets', price: 15.0, stock: 40, supplierId: supplier2.id, imageUrl: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500' },
    { name: 'Jumbo Shrimp', description: 'Wild caught jumbo shrimp', price: 20.0, stock: 30, supplierId: supplier2.id, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500' },
    { name: 'Oysters', description: 'Live oysters', price: 18.0, stock: 60, supplierId: supplier2.id, imageUrl: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=500' },
    { name: 'Scallops', description: 'Sea scallops', price: 25.0, stock: 20, supplierId: supplier2.id, imageUrl: 'https://images.unsplash.com/photo-1599084990807-36074bbefc46?w=500' },
    { name: 'Mussels', description: 'Fresh blue mussels', price: 12.0, stock: 100, supplierId: supplier2.id, imageUrl: 'https://images.unsplash.com/photo-1563261622-6b3a379fbca3?w=500' },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
