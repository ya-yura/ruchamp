const filteredApplications = useMemo(() => {
  let filtered = [];

  if (selectedTabValue === 'paid') {
    filtered = paid;

  } 
  return filtered;
}, [selectedTabValue, approved, accepted, paid]);