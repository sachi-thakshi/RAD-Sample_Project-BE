// multer middleware - request eka controller ekata yanna kalin mekata gihin thama yanne

import multer from "multer"

const storage = multer.memoryStorage() // meken wenne RAM eke save karaganna eka

export const upload = multer({ storage })