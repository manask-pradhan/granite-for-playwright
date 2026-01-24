import React, { useEffect, useState } from "react";

import FileSaver from "file-saver";

import tasksApi from "apis/tasks";
import createConsumer from "channels/consumer";
import { subscribeToReportDownloadChannel } from "channels/reportDownloadChannel";
import Button from "components/Button";
import ProgressBar from "components/Common/ProgressBar";
import Container from "components/Container";

const DownloadReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const consumer = createConsumer();

  const generatePdf = async () => {
    try {
      await tasksApi.generatePdf();
    } catch (error) {
      logger.error(error);
    }
  };

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      const { data } = await tasksApi.download();
      FileSaver.saveAs(data, "granite_task_report.pdf");
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    subscribeToReportDownloadChannel({
      consumer,
      setMessage,
      setProgress,
      generatePdf,
    });

    return () => {
      consumer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      setMessage("Report is ready to be downloaded");
    }
  }, [progress]);

  return (
    <Container>
      <div className="mx-auto mt-48 w-3/6 space-y-6 rounded-md border-2 p-4 text-center">
        <h1>{message}</h1>
        <ProgressBar progress={progress} />
        <Button
          buttonText="Download"
          dataTestId="report-pdf-download-button"
          loading={isLoading}
          onClick={downloadPdf}
        />
      </div>
    </Container>
  );
};

export default DownloadReport;
