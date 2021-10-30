const Container: React.FC = ({ children }) => {
  return (
    <>

        <div className="h-screen  flex flex-col">
            <div className="flex-1">{children}</div>
        </div>
    
     </>  
    
  );
};

export default Container;
