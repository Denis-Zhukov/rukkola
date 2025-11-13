import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) => {
    const { filename } = await params;
    const filePath = path.join(process.cwd(), 'uploads', 'lunches', filename)

    if (!fs.existsSync(filePath))
        return NextResponse.json({ error: 'Image not found' }, { status: 404 })

    const file = fs.readFileSync(filePath)
    const ext = path.extname(filename).slice(1)
    const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`

    return new NextResponse(file, { headers: { 'Content-Type': contentType } })
}
