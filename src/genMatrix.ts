import QRCodeGen from 'qrcode-generator';

export function generateMatrix(value: string, ecl: 'L' | 'M' | 'Q' | 'H' = 'M') {
    const qr = QRCodeGen(0, ecl); // 0 = auto type number
    qr.addData(value);
    qr.make();

    const count = qr.getModuleCount();
    const matrix: number[][] = [];

    for (let row = 0; row < count; row++) {
        const rowData: number[] = [];
        for (let col = 0; col < count; col++) {
            rowData.push(qr.isDark(row, col) ? 1 : 0);
        }
        matrix.push(rowData);
    }

    return matrix;
}