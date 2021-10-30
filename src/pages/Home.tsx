import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit"
import { Link } from "react-router-dom";
import { FaEdit, FaEye } from "react-icons/fa";
import { selectCampaignStatus, selectListOfCampaigns, getCampaigns, getCampaignById } from "../features/campaignSlice";
import {  useAppDispatch, useAppSelector} from "../app/hooks"
import ViewModal from "./modal/ViewModal";


const Home = () => {

    const [modalIsOpen, setModalOpen] = useState(false);
    const listOfCampaigns = useAppSelector(selectListOfCampaigns);
    const campaignStatus = useAppSelector(selectCampaignStatus);
    const dispatch = useAppDispatch();


    useEffect( () => {
        document.title = "Home Page"; 
    }, []);

    useEffect( () => {
        if(campaignStatus === 'idle'){
          dispatch(getCampaigns()).then(unwrapResult)
          .then((promiseResult) => {
            const promiseRe = promiseResult;
            //console.log(promiseRe);
          })
          .catch((error) => {
           // console.log(error)
            
          });
        }
          
      }, 
      [campaignStatus, dispatch]
    )

    const viewRecord = async (id:string, e:any) => {
      try {
        const apiResponse = await dispatch(getCampaignById(id)).unwrap();
       // console.log(apiResponse)
        if(apiResponse.hasOwnProperty('success') && apiResponse.success == true ){
          setModalOpen(true);
        }else{
  
        }
      } catch (rejectedValueOrSerializedError) {
        // handle error here
      }
   }

    const campaigns= listOfCampaigns.map((campaign, index ) => (
                <tr key={index}>
                    <td> { campaign.name } </td>
                    <td>  {  campaign.from } </td>
                    <td> { campaign.to } </td>
                    <td>{`$${campaign.daily_budget.toFixed(2)}`}</td>
                    <td>{`$${campaign.total_budget.toFixed(2)}`}</td>
                    <td className="text-center"> <Link to={`edit/${campaign.id}`}> <FaEdit className="inline mr-4 text-blue-500" /> </Link>   <FaEye className="inline text-blue-500" onClick={(e) => viewRecord(campaign.id, e)} /> </td>
                </tr>
))

  return (
    <>
    
    <div className="grid lg:grid-cols-12 p-6 lg:pr-0 gap-4 m-4">
      
      <div className="col-span-8  text-2xl">Eskimi SSP Senior full-stack PHP developer task</div>
      <div className="col-span-4 text-center text-xl ">
          <Link to="new"> <span className="btn float-right">Add New </span></Link>
      </div>

      <div className="col-span-12 ">

        <table className="table-fixed table-black ">
            <thead className="">
                <tr className="">
                <th className="w-4/12">Name</th>
                <th className="w-1/12">From</th>
                <th className="w-1/12">To</th>
                <th className="w-1/12">Daily Budget</th>
                <th className="w-1/12">Total Budget</th>
                <th className="w-1/12"></th>
                </tr>
            </thead>
            <tbody>
                { campaigns }
   
            </tbody>
        </table>

      </div>
      
          
    </div>

    <ViewModal modalIsOpen={modalIsOpen} setModalOpen={setModalOpen}  />
    
    </>
  );
};

export default Home;
