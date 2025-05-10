import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { FaDropbox, FaLink } from "react-icons/fa";
import { MdArrowDropDown, MdClose, MdImage } from "react-icons/md";
import Educator from '../../assets/Educator.svg'
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "../../Context/ThemeContext";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { isDark } = useTheme();
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const dropRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    courseTitle: "",
    description: "",
    coursePrice: 0,
    discount: 0,
    image: null,
    imageUrl: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({
    courseTitle: "",
    description: "",
    coursePrice: "",
    discount: "",
    image: "",
  });

  const [buttonText, setButtonText] = useState("Add Course");
  const [chapters, setChapters] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      courseTitle: !formData.courseTitle ? "Course title is required" : "",
      description: !formData.description ? "Description is required" : "",
      coursePrice: formData.coursePrice < 0 ? "Price cannot be negative" : "",
      discount:
        formData.discount < 0 || formData.discount > 100
          ? "Discount must be between 0-100%"
          : "",
      image: !formData.image ? "Thumbnail is required" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    return (
      formData.courseTitle &&
      formData.description &&
      formData.coursePrice >= 0 &&
      formData.discount >= 0 &&
      formData.discount <= 100 &&
      formData.image &&
      chapters.length > 0
    );
  };

  // Handle drag events for image drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setFormData({ ...formData, image: file, imageUrl: "" });
      } else {
        setErrors({ ...errors, image: "Please upload an image file" });
      }
      e.dataTransfer.clearData();
    }
  };


  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file, imageUrl: "" });
      setErrors({ ...errors, image: "" });
    } else {
      setErrors({ ...errors, image: "Please select an image file" });
    }
  };

  // Chapter management
  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter the Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  // Lecture management
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopUp(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedContent = [...chapter.chapterContent];
            updatedContent.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedContent };
          }
          return chapter;
        })
      );
    }
  };

  const handleAddLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureUrl) {
      toast.error("Please fill all lecture details");
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
        }
        return chapter;
      })
    );

    setShowPopUp(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (chapters.length === 0) {
      toast.error("Please add at least one chapter");
      return;
    }

    setButtonText("Adding Course...");

    try {
      const courseData = {
        courseTitle: formData.courseTitle,
        courseDescription: formData.description,
        coursePrice: Number(formData.coursePrice),
        discount: Number(formData.discount),
        courseContent: chapters,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("courseData", JSON.stringify(courseData));

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      } else if (formData.imageUrl) {
        // For image URLs, we might need to handle differently in backend
        formDataToSend.append("imageUrl", formData.imageUrl);
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setFormData({
          courseTitle: "",
          description: "",
          coursePrice: 0,
          discount: 0,
          image: null,
          imageUrl: "",
        });
        setChapters([]);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Error adding course"
      );
    } finally {
      setButtonText("Add Course");
    }
  };

  // Initialize Quill editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        setFormData({
          ...formData,
          description: quillRef.current.root.innerHTML,
        });
      });
    }
  }, []);

  return (
    <div
      className={`h-fit overflow-scroll  md:px-5 flex flex-col md:flex-row lg:flex-row items-start justify-between ${
        isDark ? "text-white" : "text-black"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full text-gray-500"
      >
        {/* Course Thumbnail */}
        <div className="flex flex-col gap-2">
          <label className={`${isDark ? "text-gray-200" : "text-black"}`}>
            Course Thumbnail *
          </label>

          
            <div className="flex flex-col gap-3 p-3 rounded-lg border border-gray-300">
              {/* Drag and Drop */}
              <div
                ref={dropRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/20"
                    : isDark
                    ? "border-gray-600 hover:border-gray-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FaDropbox className="mx-auto text-2xl mb-2" />
                <p>Drag & drop image here</p>
                <p className="text-xs text-gray-500">or</p>
                <label className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                  Browse files
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-xs text-blue-600 font-sans">Note: To change the thumbanail just upload new image.</p>
         

          {/* Preview */}
          {(formData.image || formData.imageUrl) && (
            <div className="mt-2">
              <p className="text-sm mb-1">Preview:</p>
              <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                <img
                  src={
                    formData.image
                      ? URL.createObjectURL(formData.image)
                      : formData.imageUrl
                  }
                  alt="Course thumbnail preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </div>

        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <label className={`${isDark ? "text-gray-200" : "text-black"}`}>
            Course Title *
          </label>
          <input
            value={formData.courseTitle}
            onChange={(e) =>
              setFormData({ ...formData, courseTitle: e.target.value })
            }
            type="text"
            placeholder="Enter course title"
            className={`outline-none md:py-2.5 py-2 px-3 rounded border ${
              isDark
                ? "bg-gray-800/40 text-white border-gray-600"
                : "bg-white text-black border-gray-500"
            }`}
            required
          />
          {errors.courseTitle && (
            <p className="text-red-500 text-sm">{errors.courseTitle}</p>
          )}
        </div>

        {/* Course Description */}
        <div className="flex flex-col gap-1">
          <label className={`${isDark ? "text-gray-200" : "text-black"}`}>
            Course Description *
          </label>
          <div
            ref={editorRef}
            className={` ${
              isDark ? "bg-gray-800/40 text-white" : "bg-white text-black"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Course Price */}
        <div className="flex flex-col gap-1">
          <label className={`${isDark ? "text-gray-200" : "text-black"}`}>
            Course Price (in $) *
          </label>
          <input
            onChange={(e) =>
              setFormData({ ...formData, coursePrice: e.target.value })
            }
            value={formData.coursePrice}
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
            className={`outline-none md:py-2.5 py-2 px-3 rounded border ${
              isDark
                ? "bg-gray-800/40 text-white border-gray-600"
                : "bg-white text-black border-gray-500"
            }`}
            required
          />
          {errors.coursePrice && (
            <p className="text-red-500 text-sm">{errors.coursePrice}</p>
          )}
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <label className={`${isDark ? "text-gray-200" : "text-black"}`}>
            Discount (%) *
          </label>
          <input
            onChange={(e) =>
              setFormData({ ...formData, discount: e.target.value })
            }
            value={formData.discount}
            type="number"
            placeholder="0"
            min="0"
            step="0.1"
            max="100"
            className={`outline-none md:py-2.5 py-2 px-3 rounded border ${
              isDark
                ? "bg-gray-800/40 text-white border-gray-600"
                : "bg-white text-black border-gray-500"
            }`}
            required
          />
          {errors.discount && (
            <p className="text-red-500 text-sm">{errors.discount}</p>
          )}
        </div>

        {/* Chapters Section */}
        <div className="mt-4">
          <h3
            className={`text-lg font-semibold mb-3 ${
              isDark ? "text-gray-200" : "text-black"
            }`}
          >
            Course Chapters *
          </h3>

          {chapters.length === 0 && (
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No chapters added yet
            </p>
          )}

          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.chapterId}
              className={`${
                isDark
                  ? "bg-gray-800/40 border-gray-700"
                  : "bg-white border-gray-300"
              } border rounded-lg mb-4`}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <MdArrowDropDown
                    onClick={() => handleChapter("toggle", chapter.chapterId)}
                    className={`mr-2 cursor-pointer transition-all ${
                      chapter.collapsed && "-rotate-90"
                    }`}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
                <MdClose
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                  className="cursor-pointer hover:text-red-500"
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.length === 0 ? (
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      No lectures in this chapter yet
                    </p>
                  ) : (
                    chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div
                        key={lecture.lectureId}
                        className="flex justify-between items-center mb-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <div>
                          <span className="font-medium">
                            {lectureIndex + 1}. {lecture.lectureTitle}
                          </span>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Duration: {lecture.lectureDuration} mins •{" "}
                            <a
                              href={lecture.lectureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View Link
                            </a>{" "}
                            •{" "}
                            {lecture.isPreviewFree ? (
                              <span className="text-green-500">
                                Free Preview
                              </span>
                            ) : (
                              <span className="text-orange-500">Paid</span>
                            )}
                          </div>
                        </div>
                        <MdClose
                          className="cursor-pointer hover:text-red-500"
                          onClick={() =>
                            handleLecture(
                              "remove",
                              chapter.chapterId,
                              lectureIndex
                            )
                          }
                        />
                      </div>
                    ))
                  )}

                  <button
                    type="button"
                    onClick={() => handleLecture("add", chapter.chapterId)}
                    className={`mt-2 px-3 py-1 rounded flex items-center gap-1 cursor-pointer ${
                      isDark
                        ? "bg-gray-600/50 text-white hover:bg-gray-600/70"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }`}
                  >
                    <span>+</span> Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => handleChapter("add")}
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer ${
              isDark
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-200 text-black hover:bg-blue-300"
            }`}
          >
            <span>+</span> Add Chapter
          </button>
        </div>

        {/* Add Lecture Popup */}
        {showPopUp && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
            <div
              className={`${
                isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
              } rounded-lg p-6 w-full max-w-md shadow-xl`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add New Lecture</h3>
                <button
                  onClick={() => setShowPopUp(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <MdClose size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Lecture Title *</label>
                  <input
                    type="text"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Enter lecture title"
                  />
                </div>

                <div>
                  <label className="block mb-1">Duration (minutes) *</label>
                  <input
                    type="number"
                    min="1"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Enter duration in minutes"
                  />
                </div>

                <div>
                  <label className="block mb-1">Lecture URL *</label>
                  <input
                    type="url"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 rounded border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Enter YouTube or video URL"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="previewFree"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="previewFree">Available as free preview</label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPopUp(false)}
                    className={`px-4 py-2 rounded ${
                      isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddLecture}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={
                      !lectureDetails.lectureTitle || !lectureDetails.lectureUrl
                    }
                  >
                    Add Lecture
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        
        <span className="text-red-500">{isFormValid()?"":"Note : All fields are required"}</span>
        <button
          type="submit"
          className={` py-3 px-6 rounded-lg font-medium transition-colors ${
            isDark
              ? isFormValid()
                ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer "
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
              : isFormValid()
              ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer "
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid() || buttonText === "Adding Course..."}
        >
          {buttonText}
        </button>
      </form>
      <div className="mt-20 pl-15 xl:block hidden">
        <img src={Educator} alt="" />
      </div>
    </div>
  );
};

export default AddCourse;
