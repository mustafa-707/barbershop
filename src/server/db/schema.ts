import { relations } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  primaryKey,
  uuid,
  pgEnum
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `barber_${name}`);

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const bookingStatusEnum = pgEnum("booking_status", ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]);
export const orderStatusEnum = pgEnum("order_status", ["PENDING", "PROCESSING", "READY", "COMPLETED", "CANCELLED"]);

export const users = createTable("user", (t) => ({
  id: t.varchar("id", { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: t.varchar("name", { length: 255 }),
  phone: t.varchar("phone", { length: 255 }),
  email: t.varchar("email", { length: 255 }),
  emailVerified: t.timestamp("emailVerified", { mode: "date", withTimezone: true }),
  image: t.varchar("image", { length: 255 }),
  role: roleEnum("role").default("USER").notNull(),
  createdAt: t.timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: t.timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}));

export const accounts = createTable(
  "account",
  (t) => ({
    userId: t.varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    type: t.varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: t.varchar("provider", { length: 255 }).notNull(),
    providerAccountId: t.varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: t.text("refresh_token"),
    access_token: t.text("access_token"),
    expires_at: t.integer("expires_at"),
    token_type: t.varchar("token_type", { length: 255 }),
    scope: t.varchar("scope", { length: 255 }),
    id_token: t.text("id_token"),
    session_state: t.varchar("session_state", { length: 255 }),
  }),
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
    index("account_userId_idx").on(account.userId),
  ]
);

export const sessions = createTable(
  "session",
  (t) => ({
    sessionToken: t.varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: t.varchar("userId", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: t.timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  }),
  (session) => [index("session_userId_idx").on(session.userId)]
);

export const products = createTable("product", (t) => ({
  id: uuid("id").defaultRandom().primaryKey(),
  nameEn: t.varchar("nameEn", { length: 255 }).notNull(),
  nameAr: t.varchar("nameAr", { length: 255 }).notNull(),
  descriptionEn: t.text("descriptionEn").notNull(),
  descriptionAr: t.text("descriptionAr").notNull(),
  imageUrl: t.varchar("imageUrl", { length: 512 }).notNull(),
  price: t.varchar("price", { length: 255 }).default("5 JOD").notNull(),
  category: t.varchar("category", { length: 255 }).default("Tools").notNull(),
  quantity: t.integer("quantity").notNull().default(0),
  isNewProd: t.boolean("isNewProd").default(true),
  createdAt: t.timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: t.timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}));

export const bookings = createTable("booking", (t) => ({
  id: uuid("id").defaultRandom().primaryKey(),
  userId: t.varchar("userId", { length: 255 }).references(() => users.id, { onDelete: "set null" }),
  guestName: t.varchar("guestName", { length: 255 }),
  guestPhone: t.varchar("guestPhone", { length: 255 }),
  bookingTime: t.timestamp("bookingTime", { withTimezone: true }).notNull(),
  status: bookingStatusEnum("status").default("PENDING").notNull(),
  createdAt: t.timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}));

export const orders = createTable("order", (t) => ({
  id: uuid("id").defaultRandom().primaryKey(),
  userId: t.varchar("userId", { length: 255 }).references(() => users.id, { onDelete: "set null" }),
  guestName: t.varchar("guestName", { length: 255 }),
  guestPhone: t.varchar("guestPhone", { length: 255 }),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  createdAt: t.timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}));

export const orderItems = createTable("order_item", (t) => ({
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("orderId").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("productId").notNull().references(() => products.id),
  quantity: t.integer("quantity").notNull().default(1),
}));

export const settings = createTable("setting", (t) => ({
  id: uuid("id").defaultRandom().primaryKey(),
  siteNameEn: t.varchar("siteNameEn", { length: 255 }).default("BarberShop"),
  siteNameAr: t.varchar("siteNameAr", { length: 255 }).default("صالون الحلاقة"),
  openingHoursEn: t.varchar("openingHoursEn", { length: 255 }).default("Mon-Sat: 10AM - 9PM | Sun: Closed"),
  openingHoursAr: t.varchar("openingHoursAr", { length: 255 }).default("الإثنين-السبت: ١٠ص - ٩م | الأحد: مغلق"),
  contactPhone: t.varchar("contactPhone", { length: 255 }),
  contactEmail: t.varchar("contactEmail", { length: 255 }),
  mapUrl: t.text("mapUrl"),
  logoUrl: t.varchar("logoUrl", { length: 512 }),
  faviconUrl: t.varchar("faviconUrl", { length: 512 }),
  descriptionEn: t.text("descriptionEn"),
  descriptionAr: t.text("descriptionAr"),
  updatedAt: t.timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  bookings: many(bookings),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
}));
