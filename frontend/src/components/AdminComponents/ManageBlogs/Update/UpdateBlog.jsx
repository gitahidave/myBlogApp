const UpdateBlog = () => {
    return ( 
        <div className="container py-4">
      
      <div className="mb-4">
        <h2 className="fw-bold">Update This Blog</h2>
        <p className="text-muted">Fill in the details below to update this existing blog.</p>
      </div>

      <form className="card border-0 shadow-sm rounded-4 p-4">

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Blog Title"
          />
          <label htmlFor="title">Title</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="Short description"
          />
          <label htmlFor="description">Description</label>
        </div>

        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            placeholder="Write your blog content"
            id="content"
            style={{ height: "150px" }}
          ></textarea>
          <label htmlFor="content">Content</label>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">
            Upload Image
          </label>

          <input
            type="file"
            className="form-control"
            accept=".jpg,.jpeg,.png"
          />

          <small className="text-muted">
            Allowed formats: JPG, JPEG, PNG
          </small>
        </div>

        <button className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
          Publish Blog
        </button>

      </form>
    </div>
     );
}
 
export default UpdateBlog;