import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";

export function CreateContentModal ({open, onClose}) {
    return (
        <>
        {open ? (
            <div className="w-screen h-screen flex items-center justify-center fixed bg-slate-300 opacity-70">
                    <div className="bg-slate-100 flex-col p-2 rounded-md flex items-center justify-between">
                        <div onClick={onClose} className="p-2 cursor-pointer flex w-full justify-end">
                            <CrossIcon />
                        </div>
                        <div className=" flex flex-col gap-2 w-60 h-40">
                           <Input onChange={()=>{}} placeholder="Enter title" />
                            <Input onChange={() => {}} placeholder="Enter link" />
                            <Button variant="primary" text="Create" />
                        </div>
                    </div>
            </div>
        ) : null}
        </>
    )
}


function Input ({ onChange, placeholder }: {onChange: () => void, placeholder: string}) {
    return (
        <input type="text" name="title" id="title" placeholder={placeholder} className="px-4 py2 w-100 h-10 border rounded-md" onChange={onChange} />
    )
}