const LabelValue = ({ label, value }) => {
    return (
      <>
        <div className="pr-4 border-r border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
        <div className="pl-4 text-sm text-gray-800 dark:text-gray-100">
          {value ?? 'Vacío'}
        </div>
      </>
    );
  };
  
  export default LabelValue;
  