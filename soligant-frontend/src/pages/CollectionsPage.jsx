import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

const CollectionsPage = () => {
  // Trạng thái
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Lấy dữ liệu
  useEffect(() => {
    // Giả lập API call
    const fetchCollections = async () => {
      try {
        setLoading(true);

        // Dữ liệu mẫu
        const mockCollections = [
          {
            id: "1",
            name: "dear-you",
            display_name: "DEAR YOU",
            description: "Bộ sưu tập quà tặng tinh tế dành cho người thân yêu",
            preview_image_url:
              "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/470612804_122127151400577763_5964901083224210280_n.jpg?stp=c0.169.1536.1536a_dst-jpg_s206x206_tt6&_nc_cat=103&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeGGeE07XkzKiC3-xCJG3Pqjnhq4aT9cMemeGrhpP1wx6Zn_8Z_PcEL77Lc77N5OKvNo1h_fR1959MO6KpWtlwFA&_nc_ohc=Gsj2NY8tFvwQ7kNvwHlPzxq&_nc_oc=AdkyQQcVrzT1grcF-BoPnJK32pVbFVBYRdGxKPAXhBUILpg9jGQ5uijy1CX-HH5nQ64Bz8lYCDmN3hlHUEoYzc8f&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=wWrUsNahKVGZIj-0vfUUWg&oh=00_AfIgE4J5G18suP-JBtmPmatS81IfHBjjYrT43wqXbJ0ArQ&oe=6845EA9E",
          },
          {
            id: "2",
            name: "birthday",
            display_name: "SINH NHẬT",
            description:
              "Món quà đặc biệt cho ngày đặc biệt của người đặc biệt",
            preview_image_url:
              "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/470878551_122127151100577763_7823558548485458797_n.jpg?stp=c0.169.1536.1536a_dst-jpg_s206x206_tt6&_nc_cat=101&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeG3rhrEh61E5tCrTDPBeqXHPRg5X5iHroY9GDlfmIeuhrR52OsEDEnQiwFBj3Rx5wnKl0B5kfjaxSKhQz5OAi1h&_nc_ohc=jcFy6nHQMbIQ7kNvwGBCW4R&_nc_oc=Adl8nabcDMbupgN60YyNBlvyKb48iol5ob801Hr9N6Hg-1r4LgZKtiHi2L1h0xECMABC8GTgweAq4JLVVG842zLV&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=wWrUsNahKVGZIj-0vfUUWg&oh=00_AfJJVYFCNPgUP9n1ziA_LhiAnoIhv-airVCy4fikfE1aDQ&oe=6845FE76",
          },
          {
            id: "3",
            name: "anniversary",
            display_name: "KỶ NIỆM",
            description:
              "Lưu giữ những khoảnh khắc đáng nhớ bằng quà tặng độc đáo",
            preview_image_url:
              "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/469945628_122125442798577763_3064317733208747550_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=105&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeGkr_QBEg7AsPa-VK3WK3WcRGPLP5_H3HpEY8s_n8fcekzoiRFOYSnJu5Ut_l1mqb8Z7MUnBsWiNhyDbBHVs3k0&_nc_ohc=W_EuwW2f6oAQ7kNvwH-ep9l&_nc_oc=AdnioqHhSrTSUgZ7ovdDMmLHDb3ofwkJDogBocYz5A2ZsXOQ9nrWjA2uphOBtJ5UEcom2mMYfX-8EtmVhNRZuS9U&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=QtJyukBAVlsWasp5sJAOPg&oh=00_AfLYv7VJ1J85cdNuvMIjthWvyGBj01XRfVbBwuWKDkKDcg&oe=6845FA03",
          },
        ];

        // Giả lập độ trễ mạng
        setTimeout(() => {
          setCollections(mockCollections);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Đã có lỗi xảy ra khi tải dữ liệu bộ sưu tập");
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div>
      {/* Banner */}
      <section className="bg-soligant-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-rafgins mb-4 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            BỘ SƯU TẬP
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Khám phá các bộ sưu tập độc đáo của chúng tôi và tạo món quà LEGO
            được cá nhân hóa cho người thân yêu
          </motion.p>
        </div>
      </section>

      {/* Collections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <Loading size="medium" color="primary" />
              <p className="mt-2">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                className="mt-4"
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2 }}
                >
                  <img
                    src={collection.preview_image_url}
                    alt={collection.display_name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-rafgins text-soligant-primary mb-3">
                      {collection.display_name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {collection.description}
                    </p>
                    <Button
                      to={`/collections/${collection.id}/customize`}
                      variant="primary"
                    >
                      Tùy chỉnh ngay
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CollectionsPage;
