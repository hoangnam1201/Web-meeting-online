import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import iconCheck from "../../../assets/iconcheck.png";
import Button from "@mui/material/Button";
import imgMeeting from "../../../assets/imagemeeting.png";
import Footer from "../Footer";
import table1 from "../../../assets/tablelayout.jpeg";
import table2 from "../../../assets/tablelayout2.jpg";
import table3 from "../../../assets/tablelayout3.jpeg";
const useStyles = makeStyles({
  root: {
    marginTop: "-100px",
    background: "blue-light",
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
    background: "#f7cea3",
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
      <div className="flex justify-center bg-blue-light  transform -translate-y-24  ">
        <div className="p-5 mt-24">
          <h1 className={classes.title}>Giao diện đẹp mắt</h1>
          <div className="flex justify-between items-center my-6">
            <div className="border-solid border-8 border-white shadow-2xl">
              <img src={table1} alt="table1" />
            </div>
            <div className="border-solid border-8 border-white shadow-2xl">
              <img src={table2} alt="table2" />
            </div>
            <div className="border-solid border-8 border-white shadow-2xl">
              <img src={table3} alt="table3" />
            </div>
          </div>
        </div>
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
