import { AxiosRequestConfig } from 'axios';
import moment from 'moment';
import { AMAZON_AMC_URL } from 'src/constants';
import {
  ICreateThreadBody,
  ICreateThreadResponse,
  IGPTAnalysePromptBody,
  IThreadMessage,
} from 'src/interfaces/amc.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const AMCGPTServices = {
  createThread: (body: ICreateThreadBody) => {
    return axiosInstance.post<IAPIResponse<ICreateThreadResponse>>(
      `${AMAZON_AMC_URL}/gpt/upload`,
      body
    );
  },
  analysePrompt: (body: IGPTAnalysePromptBody) => {
    const millisecondInTenMinutes = moment
      .duration(10, 'minutes')
      .asMilliseconds();

    const config: AxiosRequestConfig = {
      timeout: millisecondInTenMinutes,
    };
    return axiosInstance.post<IAPIResponse<IThreadMessage[]>>(
      `${AMAZON_AMC_URL}/gpt`,
      body,
      config
    );
  },
};

export default AMCGPTServices;
