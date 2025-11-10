// app/api/products/upload/route.ts
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/product';

export const POST = async (req: NextRequest) => {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const file = formData.get('file') as File;

    if (!file || !id) return NextResponse.json({ error: 'Missing file or id' }, { status: 400 });

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const uploadDir = path.join(process.cwd(), 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const safeName = product.name.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${safeName}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    product.image = `/api/products/image/${fileName}`;
    await product.save();

    return NextResponse.json({ image: product.image });
};
