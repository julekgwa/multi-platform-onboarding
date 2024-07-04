type Props = {
  image: string;
  name: string;
  surname: string;
}

export function CardUserProfile(props: Props) {
  return (
    <>
      {/*<!-- Component: User profile card --> */}
      <div className="overflow-hidden rounded bg-white text-center text-slate-500 shadow-md shadow-slate-200">
        {/*  <!-- Image --> */}
        <figure className="p-6 pb-0">
          <span className="relative inline-flex h-[200px] w-[200px] items-center justify-center text-white">
            <img
              src={props.image}
              alt="user name"
              title="user name"
              className="max-w-full"
            />
          </span>
        </figure>
        {/*  <!-- Body--> */}
        <div className="p-6">
          <header className="mb-4">
            <h3 className="text-xl font-medium text-slate-700">
              {`${props.name} ${props.surname}`}
            </h3>
            <p className=" text-slate-400">Random user</p>
          </header>
        </div>

      </div>
      {/*<!-- End User profile card --> */}
    </>
  )
}