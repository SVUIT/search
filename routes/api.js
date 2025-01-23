// Thêm route để export subjects ra file JSON
router.get('/export-subjects', async (req, res) => {
    try {
        // Kiểm tra và tạo thư mục data nếu chưa tồn tại
        const dataDir = path.join(__dirname, '../public/data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const subjects = await Subject.find({}, 'name id');
        const subjectsData = {
            lastUpdated: new Date().toISOString(),
            subjects: subjects.map(subject => ({
                id: subject.id,
                name: subject.name
            }))
        };
        
        const filePath = path.join(dataDir, 'subjects.json');
        fs.writeFileSync(filePath, JSON.stringify(subjectsData, null, 2));
        
        res.json({ success: true, message: 'Subjects exported successfully' });
    } catch (error) {
        console.error('Error exporting subjects:', error);
        res.status(500).json({ success: false, error: 'Failed to export subjects' });
    }
}); 