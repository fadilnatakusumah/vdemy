import {
  useReducer,
  createContext,
  useEffect,
  ReducerState,
  Dispatch,
  FC,
  PropsWithChildren,
} from "react";
import axios, { HeadersDefaults } from "axios";
import { useRouter } from "next/router";
import { ACTION_TYPE } from "./actions";

// initial state
const INITIAL_STATE = {
  user: null,
};

export type UserType = {
  _id: string;
  name: string;
  email: string;
  picture: string;
  role: string[];
  stripe_account_id: string;
  stripe_seller: string;
  stripe_session: string;
  password_reset_code: string;
  courses: CourseModel[];
};

export type CourseModel = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: {};
  category: string;
  published: boolean;
  paid: boolean;
  instructor: string;
  lessons: LessonModel[];
};

export type LessonModel = {
  title: string;
  slug: string;
  content: string;
  video: {};
  free_preview: boolean;
};

type storeContextType = {
  state: { user: UserType | null };
  dispatch: (_: { type: ACTION_TYPE; payload?: any }) => void;
};

// create context
const Context = createContext<storeContextType>({
  state: { user: null },
  dispatch: () => {},
});

// root reducer
const rootReducer = (
  state = INITIAL_STATE,
  action: { type: ACTION_TYPE; payload?: any }
) => {
  switch (action.type) {
    case ACTION_TYPE.LOGIN:
      return { ...state, user: action.payload };
    case ACTION_TYPE.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

interface CommonHeaderProperties extends HeadersDefaults {
  ["X-CSRF-Token"]: string;
}

// context provider
const Provider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(rootReducer, INITIAL_STATE);

  // router
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: ACTION_TYPE.LOGIN,
      payload: JSON.parse(window.localStorage.getItem("user")!),
    });
  }, []);

  axios.interceptors.response.use(
    function (response) {
      // any status code that lie within the range of 2XX cause this function
      // to trigger
      return response;
    },
    function (error) {
      // any status codes that falls outside the range of 2xx cause this function
      // to trigger
      let res = error.response;
      if (!res) return;
      if (
        res &&
        res.status === 401 &&
        res.config &&
        !res.config.__isRetryRequest
      ) {
        return new Promise((_resolve, reject) => {
          axios
            .get("/api/logout")
            .then((_data) => {
              console.log("/401 error > logout");
              dispatch({ type: ACTION_TYPE.LOGOUT });
              window.localStorage.removeItem("user");
              router.push("/join/login");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERR", err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const { data } = await axios.get("/api/csrf-token");
        console.log("CSRF", data);
        if (axios.defaults.headers !== null) {
          (axios.defaults.headers as CommonHeaderProperties)["X-CSRF-Token"] =
            data.csrfToken;
          // axios.defaults.headers = {
          //   ...axios.defaults.headers,
          //   "X-CSRF-Token": data.csrfToken,
          // } as CommonHeaderProperties;
        }
      } catch (error) {
        console.error(error);
        console.log("/401 error > logout");
        dispatch({ type: ACTION_TYPE.LOGOUT });
        window.localStorage.removeItem("user");
        router.push("/join/login");
      }
    };

    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context as StoreContext, Provider };
