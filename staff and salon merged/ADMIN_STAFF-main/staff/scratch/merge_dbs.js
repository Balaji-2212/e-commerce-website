const fs = require('fs');
const path = require('path');

const adminDbPath = path.resolve(__dirname, '../../admin/db.json');
const staffDbPath = path.resolve(__dirname, '../db.json');

console.log('Reading admin database...');
const adminDb = JSON.parse(fs.readFileSync(adminDbPath, 'utf8'));

console.log('Reading staff database...');
const staffDb = JSON.parse(fs.readFileSync(staffDbPath, 'utf8'));

const mergedDb = { ...adminDb };

// Helper to merge arrays of objects by unique identifier
function mergeArrays(arr1 = [], arr2 = [], key = 'id') {
  const map = new Map();
  arr1.forEach(item => {
    if (item && (item[key] || item.id || item.staffId)) {
      const itemKey = item[key] || item.id || item.staffId;
      map.set(itemKey, item);
    }
  });
  arr2.forEach(item => {
    if (item && (item[key] || item.id || item.staffId)) {
      const itemKey = item[key] || item.id || item.staffId;
      // If item already exists in map, merge properties (taking values from arr2 as updates)
      if (map.has(itemKey)) {
        map.set(itemKey, { ...map.get(itemKey), ...item });
      } else {
        map.set(itemKey, item);
      }
    }
  });
  return Array.from(map.values());
}

// 1. Merge core arrays
mergedDb.staff = mergeArrays(adminDb.staff, staffDb.staff, 'staffId');
mergedDb.clients = mergeArrays(adminDb.clients, staffDb.clients, 'id');
mergedDb.services = mergeArrays(adminDb.services, staffDb.services, 'id');
mergedDb.bookings = mergeArrays(adminDb.bookings, staffDb.bookings, 'id');

// 2. Add keys that are unique to staffDb
const uniqueStaffKeys = ['appointments', 'serviceTypes', 'inventoryRequests'];
uniqueStaffKeys.forEach(k => {
  if (staffDb[k]) {
    mergedDb[k] = staffDb[k];
  }
});

// Ensure all standard keys are initialized
const allKeys = [
  'clients', 'staff', 'services', 'inventory', 'bookings',
  'events', 'expenses', 'campaigns', 'tickets', 'supplies',
  'appointments', 'serviceTypes', 'inventoryRequests'
];
allKeys.forEach(k => {
  if (!mergedDb[k]) {
    mergedDb[k] = [];
  }
});

// Write unified database back to admin/db.json
fs.writeFileSync(adminDbPath, JSON.stringify(mergedDb, null, 2));
console.log('✅ Databases successfully merged and saved to admin/db.json');
