import Blog from "../models/blog.model.js";

//create blog
export const createBlog = async(req, res)=>{
    try
    {
        const { blogTitle, blogDescription, blogContent, blogImage , blogCategory} = req.body;

        //form validation
        if(!blogTitle || !blogDescription || !blogContent || !blogCategory){
            return res.status(400).json({
                success: false,
                message: "All Fields are required"
            });
        }

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "No Image selected!"
            });
        }

        const newBlog = new Blog({
            blogTitle,
            blogDescription,
            blogContent,
            blogImage: req.file.path,
            blogCategory
        });

        await newBlog.save();

        return res.status(201).json({
            success: true,
            message: "Blog Created Succesfully!"
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

//fetch blogs
export const fetchBlogs = async(req, res)=>{
    try
    {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: blogs
        });
    }
    catch(error)
    {
        //console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

//fetch blogs
export const recentBlogs = async(req, res)=>{
    try
    {
        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3);

        res.status(200).json({
            success: true,
            message: blogs
        });
    }
    catch(error)
    {
        //console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

//fetch blog details
export const blogDetails = async(req, res)=>{
    try
    {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        res.status(200).json({
            success: true,
            message: blog,
        })
    }
    catch(error)
    {
        console.log(error);
       return res.status(500).json({
            success: false,
            message: "Something went wrong"
        }); 
    }
}