import { useState } from "react";
import BlogTable from "../../BlogCard/BlogTable";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
 
const EditBlog = () => {

   const [blogs, setBlogs] = useState([]);
   const backendLink = useSelector((state)=>state.prod.link);
   const [loading, setLoading] = useState(false);

   useEffect(()=>{
    const fetchBlogs = async()=>{
        try
        {
            setLoading(true);
            const response = await axios.get(`${backendLink}/api/blog/all-blogs`, {
                withCredentials: true
            });
            setBlogs(response.data.message);
            setLoading(false);
        }
        catch(error)
        {
            setLoading(false);
            toast.error(error.response.data.message);
        }

    }
    fetchBlogs();
   }, []);

    return (
        <div className="container my-5">

            <h2
                className="text-center fw-bold mb-5"
                style={{ color: "#171819" }}
            >
                Manage Blogs
            </h2>
            {loading && <h4 className="text-success">Loading Blogs . . .</h4>}
            <BlogTable blogs={blogs} />

        </div>
    );
}

export default EditBlog;