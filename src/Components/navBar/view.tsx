import { IModel } from "./model";

export const View = (props: IModel) => (
    <div className="tw-flex tw-justify-end tw-p-[1vw] tw-items-center">
        <img className="tw-w-[3.678vw] tw-rounded-full tw-h-[3.678vw] tw-mr-[0.7vw]" alt={props.user_profile_detials.first_name + props.user_profile_detials.last_name} src={props.user_profile_detials.image} />
        <p className="tw-mr-[1vw]">{props.user_profile_detials.first_name} {props.user_profile_detials.last_name}</p>
        <p className="tw-cursor-pointer tw-text-custom_blue" onClick={() => props.action_logout()}>Log out</p>
    </div>
)