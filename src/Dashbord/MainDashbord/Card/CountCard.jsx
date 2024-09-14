import PropTypes from 'prop-types';

const DashboardCard = ({ title, count }) => {
  return (
    <div className='dashboard-card'>
      <div className="row dashboard-header">        
        <div className='col-sm-7 col-md-9'>
          <h3 className='dashboard-card_title'>{title}</h3>
          <h5 className='dashboard-card_text'>Total {title}</h5>
        </div>
        <div className='col-sm-5 col-md-3 p-2'>
          <h3 className='dashboard-card_countNumebr'>{count}</h3>
        </div>
      </div>
    </div>
  )
};

DashboardCard.propTypes = {
    title: PropTypes.string.isRequired, 
    count: PropTypes.number.isRequired
  };

export default DashboardCard
