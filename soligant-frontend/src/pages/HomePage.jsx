import { motion } from "framer-motion";
import Button from "../components/ui/Button";

const HomePage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Sample collections data
  const featuredCollections = [
    {
      id: "1",
      name: "DEAR YOU",
      description: "Bộ sưu tập quà tặng tinh tế dành cho người thân yêu",
      image:
        "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/470612804_122127151400577763_5964901083224210280_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGGeE07XkzKiC3-xCJG3Pqjnhq4aT9cMemeGrhpP1wx6Zn_8Z_PcEL77Lc77N5OKvNo1h_fR1959MO6KpWtlwFA&_nc_ohc=Gsj2NY8tFvwQ7kNvwHlPzxq&_nc_oc=AdkyQQcVrzT1grcF-BoPnJK32pVbFVBYRdGxKPAXhBUILpg9jGQ5uijy1CX-HH5nQ64Bz8lYCDmN3hlHUEoYzc8f&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=k4ovf2xGgoJHm9r6L7emgw&oh=00_AfK9DLEMRK8XGZD7ZeR0UsWqrsGRaXmm7ojgGoos3YtYxg&oe=6845EA9E",
    },
    {
      id: "2",
      name: "SINH NHẬT",
      description: "Món quà đặc biệt cho ngày đặc biệt của người đặc biệt",
      image:
        "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/470206382_122125445984577763_1832751532617206380_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=101&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeHq6l3k1XcBZYvxhUsumxC6r5H_UtCs2rqvkf9S0KzaurFttaeKOyqbVqccN3MIrYLwMsoAQZtEZutlXl6nZf6n&_nc_ohc=RpBNFuhxFTwQ7kNvwH4Pk6J&_nc_oc=Adn7DN1V01iNk7sm5WfuVQnt5m8YuUOJy5eZCh2c0h2CBt7rUqudsUYkjr3A5Pw8mgwHSCn0iMf-_qH0msW17BPM&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=K_8FAshocVMko_ohaWKUhg&oh=00_AfJ0RbTxbN-j2zlej-bj445rzbr4E3wZMBmgUnePIbB0Mw&oe=6845CB63",
    },
    {
      id: "3",
      name: "KỶ NIỆM",
      description: "Lưu giữ những khoảnh khắc đáng nhớ bằng quà tặng độc đáo",
      image:
        "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/470195658_122125442882577763_5583368458739260073_n.jpg?stp=c256.0.1536.1536a_dst-jpg_s206x206_tt6&_nc_cat=110&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeGc5otloiQuL4FKJarNIH_IvbOxQJ1Jf3-9s7FAnUl_f0hOEqACGXMGYN5P5HJ_ZRyT_Awty2hjLYJEwmUHenn_&_nc_ohc=feWdIrQQnjQQ7kNvwGGigbf&_nc_oc=AdmFPxplvBwxwZgG-Pi-USU17kcJGzib9nus6158JtfP0DjRfIHuLzv0SalIpWA3qhgw3rDhE_4SnxH75hPsrn7_&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=K_8FAshocVMko_ohaWKUhg&oh=00_AfIAwTncXy0HiV8CT5yRUVL6UoQLTqCg3vWCK0WpAk3l7w&oe=6845DF17",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-soligant-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-rafgins mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SOLIGANT
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Thương hiệu quà tặng LEGO được cá nhân hóa tinh tế cho mọi dịp
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button to="/collections" variant="secondary">
              Khám phá bộ sưu tập
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-rafgins text-soligant-primary text-center mb-10"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Bộ sưu tập nổi bật
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-rafgins text-soligant-primary mb-2">
                    {collection.name}
                  </h3>
                  <p className="mb-4">{collection.description}</p>
                  <Button
                    to={`/collections/${collection.id}`}
                    variant="primary"
                  >
                    Khám phá ngay
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soligant-secondary py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-rafgins text-soligant-primary text-center mb-10"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Quy trình đặt hàng
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-soligant-primary">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Chọn bộ sưu tập</h3>
              <p>Lựa chọn bộ sưu tập phù hợp với dịp của bạn</p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-soligant-primary">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Tùy chỉnh sản phẩm</h3>
              <p>Cá nhân hóa sản phẩm theo ý thích của bạn</p>
            </motion.div>

            <motion.div
              className="text-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-soligant-primary">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Đặt hàng & Nhận quà</h3>
              <p>Hoàn tất đơn hàng và chờ nhận sản phẩm độc đáo</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-rafgins text-soligant-primary mb-6"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Bạn đã sẵn sàng tạo món quà đặc biệt?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 max-w-3xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Hãy bắt đầu ngay hôm nay để tạo ra những món quà LEGO độc đáo, ý
            nghĩa dành tặng người thân yêu
          </motion.p>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button to="/collections" variant="primary" className="text-lg">
              Bắt đầu ngay
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
