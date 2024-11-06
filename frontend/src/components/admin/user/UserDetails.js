import React from 'react';


const UserDetails = ({ user, onClose }) => {
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">User Details</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p><strong>Name:</strong> {`${user.lastName}, ${user.firstName}`}</p>
            <p><strong>Email:</strong> {user.emailAddress}</p>
            <p><strong>Course:</strong> {user.course}</p>
            <p><strong>Section:</strong> {user.section}</p>
            <p><strong>Credit Amount:</strong> {user.creditAmount}</p>
            <p><strong>Credit Time:</strong> {user.creditTime}</p>
            <p><strong>Date Registered:</strong> {user.createdTime}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Created By:</strong> {user.createdBy ? user.createdBy.username : 'N/A'}</p> {/* Display admin username */}
            <p><strong>Uploaded Id:</strong></p>
            <img src={user.idUrl} alt="ID Picture" className="id-image img-fluid" style={{width:'20%', height: 'auto'}}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;