import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import iconCheck from "../../../assets/iconcheck.png";
import Button from "@mui/material/Button";
import imgMeeting from "../../../assets/imagemeeting.png";
import Footer from "../Footer";
import Table7 from "../../roomCall/tables/table7";
import Table4 from "../../roomCall/tables/table4";
import Table2 from "../../roomCall/tables/table2";
import Table3 from "../../roomCall/tables/table3";
const useStyles = makeStyles({
  root: {
    background: "#fff7ed",
    paddingTop: "10px",
    color: "black",
    borderBottom: "1px solid white",
  },
  textIntro: {
    paddingTop: "10px",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "25px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "30px",
    color: "black",
  },
  title2: {
    fontWeight: "bold",
    fontSize: "20px",
  },
  textContent: {
    display: "block",
    textAlign: "left",
    lineHeight: "40px",
  },
  groupText: {
    display: "flex",
  },
  container2: {
    marginTop: "15px",
    background: "#ffffff",
    color: "black",
  },
  ul: {
    listStyleType: "square",
    paddingLeft: "30px",
  },
});
const MainPage = () => {
  const classes = useStyles();
  return (
    <>
      <div className="flex justify-center bg-white">
        <div className="p-5">
          <h1 className=" text-4xl font-bold text-stone-500 tracking-wider py-4">
            Beautiful Interface & Call With Table Group
          </h1>
          <div className=" grid lg:grid-cols-5 grid-cols-2 gap-4">
            <Table7 className="h-full col-span-2" />
            <Table2 className="h-full w-56" />
            <Table3 className="h-full" />
            <Table4 className="h-full" />
          </div>
        </div>
      </div>
      <div className="overflow-hidden bg-orange-50">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 144"
          preserveAspectRatio="none"
          className="w-full h-36"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill fill-white"
          ></path>
        </svg>
      </div>
      <Container
        id="service"
        className={classes.root}
        component="div"
        maxWidth={false}
      >
        <h1 className={classes.title}>Thiết lập cho các nhóm hiện đại</h1>
        <Grid
          container
          spacing={4}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={classes.textIntro}
        >
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="100" height="100" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Video và âm thanh HD</h4>
              <p>
                Mang video và âm thanh HD tới cuộc họp của bạn với hỗ trợ lên
                tới 1000 người tham gia video và 49 video trên màn hình.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="100" height="100" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Công cụ cộng tác tích hợp</h4>
              <p>
                Nhiều người tham gia có thể đồng loạt chia sẻ màn hình của mình
                và đồng chú thích cho một cuộc họp có nhiều lượt tương tác hơn.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="100" height="100" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Dành cho Kết nối</h4>
              <p>
                Bộ lọc, cảm xúc, thăm dò ý kiến, giơ tay, và chia sẻ nhạc hoặc
                vidieo giúp cuộc hợp trở nên thú vị và hấp dẫn hơn.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="75" height="75" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Bản ghi lại và bản chép</h4>
              <p>
                Ghi lại cuộc họp của bạn vào thiết bị hoặc trên đám mây, với bản
                chép dễ dàng tìm kiếm.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="50" height="50" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Lên lịch khoa học</h4>
              <p>
                Hỗ trợ lên lịch hoặc bắt đầu cuộc họp từ Outlook, Gmail hoặc
                iCal.
              </p>
            </div>
          </Grid>
          <Grid item xs={2} sm={4} md={4} className={classes.groupText}>
            <div>
              <img width="125" height="125" src={iconCheck} alt="iconcheck" />
            </div>
            <div className={classes.textContent}>
              <h4 className={classes.title2}>Trò chuyện Nhóm</h4>
              <p>
                Trò chuyện theo nhóm, lịch sử dễ dàng tìm kiếm, chia sẻ tệp tin
                tích hợp và lưu trữ trong 10 năm. Nâng cấp dễ dàng từ cuộc gọi
                một-một hoặc gọi nhóm.
              </p>
            </div>
          </Grid>
        </Grid>
      </Container>
      <div className="overflow-hidden bg-white">
        <svg
          data-v-6da3ec0c=""
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 144"
          preserveAspectRatio="none"
          class="w-full h-36"
        >
          <path
            data-v-6da3ec0c=""
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill fill-orange-50"
          ></path>
        </svg>
      </div>
      <Container
        id="about"
        className={classes.container2}
        component="div"
        maxWidth={false}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <img width="500" height="500" src={imgMeeting} alt="meet" />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.textContent}>
              <h2 className={classes.title2}>UTE Meeting</h2>
              <p>
                Sở hữu tất cả các dịch vụ Meetings, Phone và Chat trên mọi thiết
                bị.
              </p>
              <ul className={classes.ul}>
                <li>
                  Nâng cấp cuộc trò chuyện hoặc cuộc gọi điện thoại thành cuộc
                  họp chỉ bằng một cú nhấp
                </li>
                <li>
                  Hưởng các dịch vụ đầu ngành với video và âm thanh chất lượng
                  cao nhất
                </li>
                <li>
                  Các ứng dụng được cung cấp trên nền tảng Windows, MacOS, Linux
                  cũng như iOS và Android OS
                </li>
              </ul>
              <Button variant="contained" color="warning">
                Bắt đầu sử dụng dịch vụ ngay hôm nay
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default MainPage;
