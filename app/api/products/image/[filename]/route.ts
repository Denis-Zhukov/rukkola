import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest, { params }: { params: Promise< { filename: string }> }) {
    const { filename } = await params;
    if (!filename) return NextResponse.json({ error: 'Filename is required' }, { status: 400 })

    const filePath = path.join(process.cwd(), 'uploads', 'products', filename)
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)
    const ext = path.extname(filename).substring(1)
    const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`

    return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            'Content-Type': contentType
        }
    })
}
