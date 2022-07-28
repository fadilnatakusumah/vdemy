import Wrapper from "../../components/Layout";

export default function Home() {
  return (
    <Wrapper contentProps={{ className: "px-52" }}>
      <div className="h-96 w-full bg-gray-50 p-24">
        <div className="bg-white border-dark-50 max-w-fit p-5 shadow-lg">
          <h1 className="text-3xl font-bold">Logged in!</h1>
          <p className="text-xl">
            Skills for your present (and your future). Get started with us.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-3xl font-bold">Let&apos;s start learning, Fadil</h2>
      </div>
    </Wrapper>
  );
}
