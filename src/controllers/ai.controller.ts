import { Request, Response } from "express"
import axios from "axios"

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { text , maxToken } = req.body

    const aiResponse =  await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
        contents: [
            {
                parts: [{ text }]
            }
        ],
        generationConfig: {
            maxOutputTokens: maxToken || 150
        }
        },
        {
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": "AIzaSyD8b7pFMTDD3jugpBXfDcUvn4t95Rms3p0"
            }
        }
    )

    const genratedContent =
      aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No data"

    console.log(res)

    res.status(200).json({
        data:genratedContent
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to generate AI content",
    })
  }
}
