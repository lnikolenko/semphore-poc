import type { NextPage } from "next";

const SprintPlanner: NextPage = () => {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <button className="btn btn-secondary btn-sm">
              {false && <span className="loading loading-spinner loading-xs"></span>}
                Join group
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )};

  
  export default SprintPlanner;