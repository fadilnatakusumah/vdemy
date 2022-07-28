import { Modal, Form, Input, Select } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import toast from "react-hot-toast";
import Resizer from "react-image-file-resizer";

export default function CreateCourseModalForm({
  isVisible,
  toggleModal,
  onSuccess,
}: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setPreviewFile] = useState("");
  const [fileImage, setFile] = useState<any>(null);
  const [formData] = Form.useForm();
  const router = useRouter();

  const onSubmit = async () => {
    if (!fileImage) return toast.error("Please select an image file");
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

    Resizer.imageFileResizer(
      fileImage,
      720,
      500,
      "JPEG",
      100,
      0,
      async (uri) => {
        try {
          const { data } = await axios.post("/api/course/upload-image", {
            image: uri,
          });
          console.log(
            "🚀 ~ file: CreateCourseModalForm.tsx ~ line 38 ~ data",
            data
          );
          const payload = {
            ...formData.getFieldsValue(),
            price: 10,
            image: data,
            published: true,
          };
          const createCourseResponse = await axios.post("/api/course", payload);

          // router.push("/instructor/courses");
          setIsLoading(false);
          formData.resetFields();
          toggleModal();
          onSuccess();
          // setValues({ ...values, loading: false });
        } catch (err) {
          console.error(err);
          // setValues({ ...values, loading: false });
          toast.error("Image upload failed. Try later.");
        }
      }
    );
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
    setFile(target.files![0]);
    setPreviewFile(URL.createObjectURL(target.files![0]));
  };

  return (
    <Modal
      title="Create Course"
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
    >
      <Form form={formData} onFinish={onSubmit}>
        <Form.Item
          name="name"
          rules={[
            { required: true, message: "Please input the course title!" },
          ]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[
            { required: true, message: "Please input the course description!" },
          ]}
        >
          <Input.TextArea placeholder="Description" />
        </Form.Item>
        <Form.Item
          name="paid"
          rules={[
            { required: true, message: "Please select your course type!" },
          ]}
        >
          <Select placeholder="Select your course type">
            <Select.Option value={true}>Paid</Select.Option>
            <Select.Option value={false}>Free</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          rules={[
            { required: true, message: "Please input the course category!" },
          ]}
        >
          <Input placeholder="Course category" />
        </Form.Item>
        <Form.Item label="Upload image" name="image">
          <Input
            type={"file"}
            accept="image/*"
            placeholder="Upload image"
            onChange={onChangeFile}
          />
          {filePreview && <img alt="" src={filePreview} />}
        </Form.Item>
      </Form>
    </Modal>
  );
}
