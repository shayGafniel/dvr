const mimTypes = [
  'application/pdf',
  'image/tiff',
  'text/plain',
  'text/html'
];
const statuses = [
  'done',
  'completed',
  'inProgress',
  'rejected'
];

const getMimtype = () => {
  const mimtypesIndex = Math.floor(Math.random() * mimTypes.length);
  return mimTypes[mimtypesIndex];
};
const getStatus = () => {
  const statusIndex = Math.floor(Math.random() * statuses.length);
  return statuses[statusIndex];

};
export const imageInfoBody = () => {
  return ({

    id: Math.floor(1000 + Math.random() * 9999).toString(),
    mimeType: getMimtype(),
    metaData: {
      numberOfPages: 1,
      pageHeight: 2339,
      pageWidth: 1700,
    },
    processes: [
      {
        id: Math.floor(1000 + Math.random() * 9999).toString(),
        assetId: Math.floor(1000 + Math.random() * 9999).toString(),
        action: 'pdfdigest',
        status: getStatus(),
        created: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
        updated: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
        expiresOn: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
      },
    ]
  });
};


