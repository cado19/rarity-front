import React, { useEffect, useState } from "react";
import contractTop from "../../assets/rarity_contract_top.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";

export default function ShowContract() {
  const { id } = useParams();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const contractURL = baseURL + `/api/contracts/read_single.php?id=${id}`;
  const signatureURL = baseURL + '/files/signatures/' + contract?.signature;

  const getContract = async () => {
    try {
      axios.get(contractURL).then((response) =>{
        console.log(response);
        setContract(response.data.contract);
        setLoading(false);
      })
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  }

  useEffect(() => {
    getContract();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="px-2">
      <div>
        <img src={contractTop} />
      </div>
      <div className="columns-2">
        <div>
            <table>
                <tbody>
                    <tr><td><b>HIRER FULL NAME</b></td></tr>
                    <tr><td><b>{contract.c_fname} {contract.c_lname}</b></td></tr>
                    <tr><td>DRIVER: {contract.d_fname} {contract.d_lname}</td></tr>
                    <tr><td>HIRER PHYSICAL ADDRESS: {contract.c_residential_address}</td></tr>
                    <tr><td>REFEREE NAME</td></tr>
                    <tr><td>REFEREE ID NO</td><td>SIGN</td><td>TEL NO</td></tr>
                    <tr><td></td></tr>
                </tbody>
            </table>
        </div>
        <div>
            <table>
				<tbody>
					<tr><td><b>CASH</b></td><td><b>CHEQUE</b></td></tr>
					<tr><td><b>SHS PER DAY</b></td><td><b>CAR MAKE</b></td><td><b>CAR MODEL</b></td></tr>
					<tr><td>{contract.custom_rate > 0 ? contract.custom_rate : contract.daily_rate}</td><td>{contract.make}</td><td>{contract.model}</td></tr>
					<tr><td><b>CAR  CHECKED IN AT</b></td></tr>
					<tr><td><b>DATE IN</b> {contract.end_date}</td><td><b>TIME IN</b> {contract.start_time}</td></tr>
					<tr><td><b>DATE OUT</b> {contract.start_date}</td><td><b>TIME OUT</b> {contract.end_time}</td></tr>
				</tbody>
			</table>
        </div>
      </div>
      <div>
        <table>
			<tr>
				<td><b>D.L NO.</b></td>
				<td></td>
				<td><b>KMS IN</b></td>
				<td><b>COST X DAYS={contract.total}</b></td>
				<td></td>
			</tr>
			<tr>
				<td><b> COUNTRY</b></td>
				<td></td>
				<td><b>KMS OUT</b></td>
				<td><b>PAID SHS.</b></td>
				<td></td>
			</tr>
		</table>
      </div>
      <div>
        <table class="table table-bordered">
			<tr>
				<td>
						THE UNDERSIGNED AM HIRING CAR NO.........{contract.number_plate}......... IN GOOD CONDITION AM LIABLE TO PAY ANY DAMAGE CAUSED TO THIS CAR.
				</td>
			</tr>
		</table>
      </div>
      <div className="flex justify-end w-52">
        {contract.signature ? <img src={signatureURL} /> : <p>SIGNATURE</p>}
        
      </div>
      <div>
        <table class="table table-bordered">
            <tr>
                <td> C.S NO.</td>
                <td> INV NO. </td>
                <td> OUT BY </td>
                <td>IN BY </td>
                <td>CALCULATIONS. BY</td>
            </tr>
        </table>
      </div>
      <div>
        <p>
            NB: THE VEHICLE IS NOT AUTHORISED TO TRAFFIC ANY PROHIBITED GOODS OR BE USED AS TAXI.
                THE VEHICLE MUST NOT BE USED TO AID ANY CRIMINAL ACTIVITIES AS PRESCRIBED UNDER THE LAWS OF
                KENYA AND IF FOUND, THE HIRER WILL BE PERSONALLY LIABLE AS PER THE LAW.
                THE HIRER INDEMNIFIES AND SHALL KEEP THE COMPANY INDEMNIFIED OF ANY CRIMINAL OR CIVIL
                LIABILITY THAT MAY OCCUR AS A RESULT OF ANY MISUSE OF THE VEHICLE OR ACTIONS OF THE HIRER
        </p>
      </div>
      <div>
        <h3 className="text-center text-4xl font-bold">TERMS & CONDITIONS</h3>
        <p>1. Rarity rent a car here by agrees to let this vehicle on self-drive hire to the person named overleaf (the Hirer) and the hirer hereby agrees to take
the motor vehicle hereinafter called the (“the vehicle”) upon the terms and conditions set to overleaf and conditions set out overleaf and hereun
der.</p>
		<p>2. The period of hire shall be as set out overleaf and the vehicle must be returned to the company on the date and time set out overleaf. Unless the
period is extended by notifying the company in writing or by special arrangements to be made in writing by the hirer when signing the contract.
 Whenever this clause is violated, the company will charge the hirer an hourly fees of KES. 1000 for every extra hour incurred.</p>
		<p>3. In accepting the vehicle, the hirer shall be deemed to have satisfied himself that the vehicle is road worthy and in a proper and safe condition and
working order and the company shall not be liable to make any payments to the Hirer in an event or in case of any breakdown. The company will
also not be accused or blamed to have provided a faulty or un-road worthy car to the hirer for any events occurring during the rental period.</p>
		<p>4. The hire charges shall be based on the number of days the vehicle is hired for and the mileage done during the period between the dates when
the vehicle is taken from the company’s premises and returned there. The rates per day plus kilometer are set out overleaf where the odome
ter records in Kilometers. If the speedometer seal has been tampered with the charges shall be at the rate of Ksh. 50,000 and the hirer shall be
responsible for replacing it.</p>
		<p>5. The hirer further agrees that
 He will not drive (and ensure that any unauthorized driver will not drive) the vehicle whilst under the influence of alcohol, Hallucinations, drugs narcotic,
barbiturates and any other substances impairing the driver’s consciousness or ability to control the vehicle. The vehicle will be driven skillfully and all
Traffic Laws and Rules and the provisions of the Highway code shall at all times be complied with and observed.</p>
		<p><b>The vehicle shall</b></p>
		<p>a. Not be overloaded or carry more passengers than its passenger capacity specified on the insurance license on the windscreen</p>
		<p>b. he vehicle will be driven by the hirer or any other driver named overleaf who must have a current bona fides driver’s license for a minimum of 2 years and must be not less than 23 years and not more than 70 years of age.</p>
		<p> c. The vehicle will be kept locked and secured when packed and every precaution will be taken to avoid theft of it or any item in it and damage.</p>
		<p>d. The vehicle shall be used for social and pleasure purposes and only on weather roads, the vehicle shall not be used for racing or pace making nor for carrying fare-paying passengers.</p>
		<p>e. The vehicle shall not be taken out of Kenya,</p>
		<p> f. The Hirer shall promptly and timely pay parking and traffic fines and if he shall fail to do so, he shall be responsible to pay additional 1000/= plus each fine not paid and indemnify the company for any loss or damage it may suffer as a result of this.</p>
		<p> g. The Hirer shall at all times check the oil and water and tyre pressure and In the event fails to do so he shall be responsible to reimburse and  indemnify the company for any loss, damage or expenses that it may suffer.</p>
		<p>h. Unless authorized by the company in writing. The hirer under no circumstances shall modify, or repair the vehicle. The company shall not be liable for any defects arising as a result of such undeclared modifications or repairs.</p>
		<p> 6. Notwithstanding anything herein contained in case of breakdown or any accident or damage as a result of a willful act or gross neglect of the: -The hirer or authorized driver, the Hirer shall pay the company the total cost of towing the car to the company’s premises and the full cost of repairing the vehicle or replacement of the vehicle if un-repairable,</p>
		<p>a. The Hirer shall be responsible to pay for the repair of punctures, replacing burst tyres, stolen or lost spare tyres, damaged or broken windscreen or glasses, damaged tools (including jack and handle), tape recorder and radio.</p>
		<p>b. In case of an accident (Involving the vehicle) the Hirer or the authorized driver shall report the accident to the police and the company within 24 hours no matter how minimal the damage is and supply the company with the police officer’s name, number and details of the police station and a police abstract. Under no circumstances shall liability be admitted. The hirer shall be at the earlier opportunity and in any case not later than 48 hours after the occurrence of the accident give a full statement in writing of how the accident occurred and also provide a copy of the police abstraction form duty completed. If and when required, shall make available the authorized driver to give any statement as may be required by the company.</p>
		<p>c. If any anti-theft device installed in the vehicle is not utilized by the hirer and the vehicle is stolen, the police will be informed then the hirer will be called upon to pay the costs of the vehicle.</p>
		<p>i. The insurance policy covering the vehicle has been made available to the hirer and hereby acknowledges that he or she and the authorized driver shall at all times comply with the terms and conditions of this company and the insurance policy.</p>
		<p>ii. Damage to the vehicle or loss by fire or theft of the vehicle or any material damage to any other vehicle or property and the driver and the passengers are not covered. In case of a third-party injury claim, the hirer shall be responsible to bear the claim and excess premium as stated overleaf. THE COMPANY WILL NOT BE RESPONSIBLE FOR ANY SUCH LIABITY.</p>
		<p>iii. The insurance, whether or not the CDW option is exercised does not cover it.</p>
		<p> a. Any loss of items from the vehicle.</p>
		<p> b. Any breakdown or damage to the vehicle otherwise than by collision,</p>
		<p> c. Injuries or loss to the hirer or driver or the passengers.</p>
		<p> d. Burst tyres, stolen, lost spare wheel, damaged OR broken windscreen or glasses, damaged rims, tools (including jack & handle)</p>
		<p>All cars are insured. But in all cases the first Ksh…………{contract.vehicle_excess}……. Excess premiums depending on the vehicle hired on every claim are
 the responsibility of the hirer.</p>
		<p><b>IMPORTANT</b></p>
		<p> The insurance cover (s) aforesaid is available only if the terms and conditions contained herein and in the insurance policy are complied with failing with the hirer and the authorised driver shall be fully responsible for all damages and costs and shall fully indemnify the company in respect of any loss or damage suffered by the vehicle of the company or for any claims received by the company and all costs and expenses.</p>
		<p><b>PAYMENT TERMS</b></p>
		<p>7. Besides the deposit, full identifications and physical address of the hirer must be given and where required by the company an acceptable
guarantee shall be given.</p>
		<p>8. No relaxation, forbearance or indulgence by the company in enforcing any of the terms or conditions of his agreement shall prejudice or affect the rights and power of the company hereunder nor shall not any waiver of any breach operate as a waiver of any subsequent or continuing breach. I hereby agree to all terms and conditions of this contract and accept full responsibility of the vehicle until it is returned to the company.</p>
      </div>
      <div className="columns-2">
        <p>Hirer's Signature: {contract.signature ? <img src={signatureURL} /> : <p>SIGNATURE</p>}</p>
        <p>Date: {contract.created_at}</p>
      </div>
    </div>
  );
}
