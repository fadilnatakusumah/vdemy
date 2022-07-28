import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserAPI from "../api/user";
import Wrapper from "../components/Layout";
import { ACTION_TYPE } from "../context/actions";
import { useStore } from "../context/hooks";

export default function Me() {
  const { state, dispatch } = useStore();
  // const [state, setState] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        const { data } = await UserAPI.me();
        dispatch({ type: ACTION_TYPE.LOGIN, payload: data });
      } catch (error: any) {
        toast.error(error.response.data);
      }
    };

    if (!state.user) {
      getMe();
    }
  }, []);

  return (
    <Wrapper contentProps={{ className: "px-52" }}>
      <div className="h-96 w-full bg-gray-50 p-24">
        <div className="bg-white border-dark-50 max-w-fit p-5 shadow-lg">
          <h1 className="text-3xl font-bold">Learning that gets you</h1>
          <p className="text-xl">
            Skills for your present (and your future). Get started with us.
          </p>
        </div>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
      <div className="mt-10">
        <h2 className="text-3xl font-bold">Let&apos;s start learning, Fadil</h2>
      </div>
    </Wrapper>
  );
}
