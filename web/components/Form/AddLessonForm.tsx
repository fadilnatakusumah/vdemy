import { Modal, Form, Input, Select, Progress } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import toast from "react-hot-toast";
import Resizer from "react-image-file-resizer";
import { useStore } from "../../context/hooks";

export default function AddLessonForm({
  isVisible,
  toggleModal,
  onSuccess,
  course,
}: any) {
  const { state } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setPreviewFile] = useState("");
  const [fileVideo, setFile] = useState<any>(null);
  const [uploadProgress, setProgress] = useState(0);
  const [formData] = Form.useForm();
  const router = useRouter();

  const onSubmit = async () => {
    if (!fileVideo) return toast.error("Please select an image file");
    // console.log(
    //   "🚀 ~ file: CreateCourseModalForm.tsx ~ line 8 ~ onSubmit ~ values",
    //   values
    // );
    // console.log("formData", formData.getFieldsValue());
    // console.log(
    //   "🚀 ~ file: CreateCourseModalForm.tsx ~ line 8 ~ CreateCourseModalForm ~ fileImage",
    //   fileImage
    // );
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append("video", fileVideo);
      const { data } = await axios.post(
        `/api/course/video-upload/${course?.instructor?._id}`,
        formPayload,
        {
          onUploadProgress: (e) => {
            console.log(
              "🚀 ~ file: AddLessonForm.tsx ~ line 43 ~ onSubmit ~ e",
              e
            );
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      const payload = {
        ...formData.getFieldsValue(),
        video: data,
      };
      const createLessonResponse = await axios.post(
        `/api/course/lesson/${router.query.slug}/${course.instructor._id}`,
        payload
      );
      console.log(
        "🚀 ~ file: AddLessonForm.tsx ~ line 47 ~ onSubmit ~ createLessonResponse",
        createLessonResponse
      );

      // router.push("/instructor/courses");
      setIsLoading(false);
      formData.resetFields();
      toggleModal();
      onSuccess();
      // setValues({ ...values, loading: false });
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      // setValues({ ...values, loading: false });
      toast.error("Image upload failed. Try later.");
    }
    // Resizer.imageFileResizer(
    //   fileVideo,
    //   720,
    //   500,
    //   "JPEG",
    //   100,
    //   0,
    //   async (uri) => {

    //   }
    // );
    // let file = e.target.files[0];
    // setPreview(window.URL.createObjectURL(file));
    // setUploadButtonText(file.name);
    // setValues({ ...values, loading: true });
    // // resize
    // Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
    //   try {
    //     let { data } = await axios.post("/api/course/upload-image", {
    //       image: uri,
    //     });
    //     console.log("IMAGE UPLOADED", data);
    //     // set image in the state
    //     setImage(data);
    //     setValues({ ...values, loading: false });
    //   } catch (err) {
    //     console.log(err);
    //     setValues({ ...values, loading: false });
    //     toast("Image upload failed. Try later.");
    //   }
    // });
    // const uploadImage = axios.post("/api/course/upload-image", );
    // const resp = axios.post();
  };

  const onChangeFile = ({ target }: ChangeEvent<HTMLInputElement>) => {
    console.log(
      "🚀 ~ file: AddLessonForm.tsx ~ line 95 ~ onChangeFile ~ target",
      target
    );
    setFile(target.files![0]);
    setPreviewFile(URL.createObjectURL(target.files![0]));

    const check = formData.getFieldsValue();
    console.log(
      "🚀 ~ file: AddLessonForm.tsx ~ line 100 ~ onChangeFile ~ check",
      check
    );
  };

  return (
    <Modal
      title="Add Lesson"
      visible={isVisible}
      onOk={onSubmit}
      onCancel={toggleModal}
      confirmLoading={isLoading}
      okButtonProps={{
        disabled: isLoading,
        className: "bg-blue-400",
      }}
      cancelButtonProps={{
        disabled: isLoading,
      }}
      destroyOnClose
    >
      <Form form={formData} onFinish={onSubmit}>
        <Form.Item
          name="title"
          rules={[
            { required: true, message: "Please input the lesson title!" },
          ]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item
          name="content"
          rules={[
            { required: true, message: "Please input the lesson description!" },
          ]}
        >
          <Input.TextArea placeholder="Description" />
        </Form.Item>

        <Form.Item label="Upload video">
          <Input
            name="image"
            type={"file"}
            accept="video/*"
            placeholder="Upload video"
            onChange={onChangeFile}
          />
          {filePreview && <video width="400" src={filePreview} controls />}
        </Form.Item>
        {uploadProgress > 0 && (
          <Progress percent={uploadProgress} status="active"  />
        )}
      </Form>
    </Modal>
  );
}
