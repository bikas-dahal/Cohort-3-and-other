import express from 'express'
import { ContentModel, LinkModel, UserModel } from './db'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config'
import { authMiddleware } from './middleware'
import { randomString } from './utils'
import { Request, Response } from 'express';
import cors from 'cors' 


const app = express()

app.use(express.json()) 
app.use(cors())

app.post('/api/v1/signup', async (req, res) => {
    const { username, password } = req.body

    // todo: zod validation and password hashing
    try {
        await UserModel.create({
            username, 
            password
        })
    
        res.json({
            message: 'User registered successfully'
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            error: error
        })
        
    }
})

app.post('/api/v1/login', async (req, res) => {
    const { username, password } = req.body

    const user = await UserModel.findOne({
        username, 
        password
    })

    if (user) {
        const token = jwt.sign({
            id: user._id,
            username
        }, JWT_SECRET)

        res.json({
            token
        })
    } else {
        res.json({
            error: 'Invalid credentials'
        })
    }

    console.log(user);
    
    res.json({
        user
    })

    
})

app.post('/api/v1/content', authMiddleware, async (req, res) => {
    const { link, title } = req.body

    await ContentModel.create({
        link,
        title,
        // @ts-ignore
        userId: req.userId,
        tags: []

    })

    res.json({
        success: "Content created successfully"
    })
})

app.get('/api/v1/content', authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId

    const content = await ContentModel.find({
        userId
    }).populate('userId', 'username')

    res.json({
        content
    })
})

app.delete('/api/v1/content', authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId

    const contentId = req.body.contentId; 

    const content = await ContentModel.deleteMany({
        contentId,
        userId
    });

    res.json({
        content
    })
})

app.post('/api/v1/brain/share', authMiddleware, async (req, res) => {
    const { share } = req.body

    
    if (share) {
        
        const existingLink = await LinkModel.findOne({
            // @ts-ignore
            userId: req.userId
        })

        if (existingLink) {
            res.json({
                message: existingLink
            })
            return
        }
        
        const hash = randomString(6)
        await LinkModel.create({
            // @ts-ignore
            userId: req.userId,
            hash
        })

        res.json({
            success: 'Link created',
            link: `http://localhost:3000/api/v1/brain/${hash}`
        })
    } else {
        await LinkModel.deleteOne({
            // @ts-ignore
            userId: req.userId
        })

        res.json({
            success: 'Link removed'
        })
    }

})

// @ts-ignore
app.get('/api/v1/brain/:shareLink', async (req: Request<{ shareLink: string }>, res: Response) => {
    try {
        const { shareLink } = req.params;

        // Find the link by its hash
        const link = await LinkModel.findOne({ hash: shareLink }).lean();

        if (!link) {
            return res.status(404).json({ error: 'Invalid link' });
        }

        // Find the content associated with the userId
        const content = await ContentModel.findOne({ userId: link.userId }).lean();

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        return res.json({ content });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

