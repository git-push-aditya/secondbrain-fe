const Tag = ({name,id}:{name:string, id: string}) => {
    return <div className="inline-flex justify-center whitespace-nowrap cursor-pointer text-center items-center bg-tagBg  p-2 rounded-4xl hover:border-1 hover:border-slate-400 transition-hover duration-200 text-tagText border-1 border-tagBg" id={id}>
        {
            name != "..." ? <>#{name}</> : <>{name}</> 
        }
        
    </div>
}

export default Tag;

