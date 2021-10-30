import { useEffect } from 'react';
import { ModalProps } from "../../types/modalProps";
import Modal from '../../components/MediumModal';
import { useHistory } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import { selectCampaignFiles, selectCampaignRecord, fileType } from "../../features/campaignSlice";
import {  useAppSelector } from "../../app/hooks";


const ViewModal = ({ modalIsOpen, setModalOpen }: ModalProps) => {
  const history = useHistory();
  const files = useAppSelector(selectCampaignFiles);
  const campaign = useAppSelector(selectCampaignRecord);
  let campaignImages = files.map((campaignFile) => {
                    <div className="col-span-4 " key={campaignFile.id}> 
                      <img src={campaignFile.file_path} alt="picture" />
                    </div>
                });
  

  return (
    <Modal modalIsOpen={modalIsOpen} setModalOpen={setModalOpen}>
      <div className="flex items-center justify-end mb-4">
        <button className="text-3xl" onClick={() => setModalOpen(false)}>
          <IoClose />
        </button>
      </div>
      <div className="flex flex-col items-center px-4 space-y-5">
        <h2 className="text-blue-900 text-2xl"> Name: {campaign.name && campaign.name}  {files.length>0 && ` with ${files.length} Files`}</h2>
        <p className="text-xl"> From: {campaign.from && campaign.from }  </p>
        <p className="text-xl"> To: {campaign.to && campaign.to }  </p>
        <p className="text-xl"> Daily Budget:  {campaign.daily_budget && `$${campaign.daily_budget}`}  </p>
        <p className="text-xl"> Total Budget:  {campaign.total_budget && `$${campaign.total_budget }`}  </p>
        <p className="text-xl"> Files : {files.length>0 && `  ${files.length} Files`} </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              { campaignImages }
        </div>
    </Modal>
  );
};

export default ViewModal ;
