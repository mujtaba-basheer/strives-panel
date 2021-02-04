import React, { Component } from "react";
import apiCall from "../utils/apiCall";

export default class notifi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationData: {
        agreementDetails: {},
        bankDetails: {},
        paytmDetails: {},
        businessDetails: {},
        personalDetails: {},
        userDocuments: {},
      },
    };
  }
  componentDidMount() {
    apiCall.get("notification").then((response) => {
      if (response.data.status) {
        this.setState({ notificationData: response.data.data });
      }
    });
  }
  render() {
    var { notificationData } = this.state;
    console.log(notificationData);
    return (
      <div className="notification-Sidebar">
        <div className="notification-body">
          <div className="logo" style={{ height: "60px" }} />
          <img
            alt=""
            src="/close.png"
            className="d-block"
            onClick={(e) => {
              document.body.classList.toggle("notifOpen");
            }}
            style={{
              cursor: "pointer",
              width: "15px",
              marginLeft: "20px",
              position: "absolute",
              right: "15px",
              top: "25px",
            }}
          />
          <h4 className="mb-3 ml-3" style={{ color: "white" }}>
            Notifications
          </h4>
          {notificationData ? (
            <React.Fragment>
              {notificationData.agreementDetails ? (
                <div className="single-noti">
                  Agreement Details{" "}
                  {notificationData.agreementDetails.isApproved ? "has been approved." : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.bankDetails ? (
                <div className="single-noti">
                  Bank Details{" "}
                  {notificationData.bankDetails.isApproved ? "has been approved." : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.businessDetails ? (
                <div className="single-noti">
                  Business Details{" "}
                  {notificationData.businessDetails.isApproved ? "has been approved." : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.paytmDetails ? (
                <div className="single-noti">
                  Paytm Details{" "}
                  {notificationData.paytmDetails.isApproved ? "has been approved." : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.personalDetails ? (
                <div className="single-noti">
                  Personal Details{" "}
                  {notificationData.personalDetails.isApproved ? "has been approved." : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.userDocuments ? (
                <div className="single-noti">
                  Aadhar Card document{" "}
                  {notificationData.userDocuments.isaadharapproved
                    ? "has been approved."
                    : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.userDocuments ? (
                <div className="single-noti">
                  Personal PAN document{" "}
                  {notificationData.userDocuments.isbusiness_panapproved
                    ? "has been approved."
                    : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.userDocuments ? (
                <div className="single-noti">
                  Cancelled Cheque document{" "}
                  {notificationData.userDocuments.iscancelled_chequeapproved
                    ? "has been approved."
                    : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.userDocuments ? (
                <div className="single-noti">
                  Business PAN document{" "}
                  {notificationData.userDocuments.ispanapproved ? "has been approved." : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.userDocuments ? (
                <div className="single-noti">
                  FSAAI Licensce document{" "}
                  {notificationData.userDocuments.isfsaai_licenseapproved
                    ? "has been approved."
                    : "is marked with discripency"}{" "}
                </div>
              ) : null}

              {notificationData.userDocuments ? (
                <div className="single-noti">
                  Trade Licensce document{" "}
                  {notificationData.userDocuments.istrade_licenseapproved
                    ? "has been approved."
                    : "is marked with discripency"}{" "}
                </div>
              ) : null}
            </React.Fragment>
          ) : null}
        </div>
      </div>
    );
  }
}
