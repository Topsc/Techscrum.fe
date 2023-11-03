import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config/config';

const LabelContext = createContext<any>({});

interface IRolesProvider {
  children?: React.ReactNode;
}

interface IProps {
  id: string;
  name: string;
  slug: string;
}

function selectProps(obj: IProps) {
  const { id, name, slug } = obj;
  return { id, name, slug };
}

function LabelsProvider({ children }: IRolesProvider) {
  const [labels, setLabels] = useState<IProps[]>([]);

  const getCompanyLabels = async () => {
    const path = `${config.apiAddress}/labels`;
    const res = await axios.get(path);
    const labelsData = res.data.map(selectProps);
    setLabels(labelsData);
  };

  useEffect(() => {
    getCompanyLabels();
  }, []);

  return <LabelContext.Provider value={labels}>{children}</LabelContext.Provider>;
}

LabelsProvider.defaultProps = {
  children: null
};

export { LabelContext, LabelsProvider };
