import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Edit, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { DeleteProductButton } from "./_components/delete-product-button";

import { getTranslations } from "next-intl/server";

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const t = await getTranslations('Admin');
  const common = await getTranslations('Common');
  
  const allProducts = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between bg-white/5 dark:bg-black/20 p-8 rounded-[2rem] border border-white/10 glass shadow-xl">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{t('productsTitle')}</h1>
          <p className="text-muted-foreground text-lg">{t('productsDesc')}</p>
        </div>
        <Button asChild className="h-14 px-8 rounded-2xl btn-premium text-white shadow-xl">
          <Link href="/admin/products/new">
            <Plus className="mr-3 h-5 w-5" />
            {t('addProduct')}
          </Link>
        </Button>
      </div>

      <div className="border border-white/10 rounded-[2rem] bg-background/50 overflow-hidden shadow-2xl glass">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/10 h-16">
              <TableHead className="px-8 font-black text-xs uppercase tracking-widest">{t('nameEnAr')}</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest">Price</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest">{t('quantity')}</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest">{t('isNew')}</TableHead>
              <TableHead className="text-right px-8 font-black text-xs uppercase tracking-widest">{common('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-8 py-6">
                  <div className="font-black text-lg">{product.nameEn}</div>
                  <div className="text-sm font-bold text-muted-foreground">{product.nameAr}</div>
                </TableCell>
                <TableCell className="font-bold text-lg">{product.price}</TableCell>
                <TableCell className="font-bold text-lg">{product.quantity}</TableCell>
                <TableCell>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${product.isNewProd ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                      {product.isNewProd ? common('yes') : common('no')}
                   </span>
                </TableCell>
                <TableCell className="text-right px-8 space-x-3">
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-white/5 hover:bg-white/10" asChild>
                    <Link href={`/admin/products/${product.id}`}>
                      <Edit className="h-5 w-5" />
                    </Link>
                  </Button>
                  <DeleteProductButton id={product.id} />
                </TableCell>
              </TableRow>
            ))}
            {allProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-24 text-muted-foreground space-y-4">
                  <ShoppingBag className="h-16 w-16 mx-auto opacity-10" />
                  <p className="text-xl font-bold">{t('noProducts')}</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
