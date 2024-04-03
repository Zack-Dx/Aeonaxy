import fs from 'node:fs/promises'

export const removeFileFromLocal = async (localPath) => {
    try {
        await fs.unlink(localPath)
    } catch (error) {
        console.log('Failed to remove file from local path')
    }
}
