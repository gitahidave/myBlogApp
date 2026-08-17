import Blog from "../models/blog.model.js";
import { cloudinary } from "../utils/cloudinary.js";

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

//update blog
export const updateBlog = async(req, res)=>{
    try
    {
        const { id } = req.params;
        const { blogTitle, blogDescription, blogContent, blogCategory } = req.body;

        const blog = await Blog.findById(id);

        if(!blog)
        {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found!"
            });
        }

        //form validation
        if(!blogTitle || !blogDescription || !blogContent || !blogCategory){
            return res.status(400).json({
                success: false,
                message: "All Fields are required"
            });
        }

        blog.blogTitle = blogTitle;
        blog.blogDescription = blogDescription;
        blog.blogContent = blogContent;
        blog.blogCategory = blogCategory;

        //only replace the image if a new one was uploaded
        if(req.file)
        {
            //remove old image from cloudinary
            if(blog.blogImage)
            {
                try
                {
                    const publicId = blog.blogImage
                        .split("/")
                        .slice(-2)
                        .join("/")
                        .split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                catch(err)
                {
                    console.log(err);
                }
            }
            blog.blogImage = req.file.path;
        }

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog Updated Successfully!"
        });
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

//delete blog
export const deleteBlog = async(req, res)=>{
    try
    {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if(!blog)
        {
            return res.status(404).json({
                success: false,
                message: "Blog Not Found!"
            });
        }

        //remove image from cloudinary
        if(blog.blogImage)
        {
            try
            {
                const publicId = blog.blogImage
                    .split("/")
                    .slice(-2)
                    .join("/")
                    .split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            catch(err)
            {
                console.log(err);
            }
        }

        await Blog.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Blog Deleted Successfully!"
        });
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