import Wrapper from "../../components/Layout";

export default function Instructor() {
  return (
    <Wrapper contentProps={{ className: "px-52" }}>
      <div className="h-96 w-full bg-gray-50 p-24">
        <div className="bg-white border-dark-50 max-w-fit p-5 shadow-lg">
          <h1 className="text-3xl font-bold">Learn More about instructor</h1>
          <p className="text-xl">Make your own course and teach other people</p>
        </div>
      </div>
    </Wrapper>
  );
}
