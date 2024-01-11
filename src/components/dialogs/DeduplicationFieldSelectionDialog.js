import React, { useState } from "react";
import { injectIntl } from "react-intl";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  formatMessage,
  formatMessageWithValues,
} from "@openimis/fe-core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const styles = (theme) => ({
  item: theme.paper.item,
});

const DeduplicationFieldSelectionDialog = ({
  intl,
  classes,
  benefitPlan,
}) => {
  console.log('intl', intl);

  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={handleOpen} 
        variant="outlined" 
        color="#DFEDEF" 
        className={classes.button}
        style={{ 
          border: "0px",
          textAlign: "right",
          display: "block",
          marginLeft: "auto",
          marginRight: 0
        }}
      >
        {formatMessage(intl, "deduplication", "deduplicate")}
      </Button>
      <Dialog 
        open={isOpen} 
        onClose={handleClose} 
        PaperProps={{
          style: {
            width: 900,
            maxWidth: 900,
          },
        }}
      >
        <DialogTitle 
          style={{ 
            marginTop: "10px",
          }}
        >
          Pr
        </DialogTitle>
        <DialogContent>
          <></>
        </DialogContent>
        <DialogActions 
          style={{ 
            display: "inline", 
            paddingLeft: "10px",
            marginTop: "25px",
            marginBottom: "15px"  
          }}
        >
          <div>
            <div style={{ float: "left" }}>
            </div>
            <div style={{ 
                float: "right", 
                paddingRight: "16px" 
              }}
            >
              <Button 
                onClick={handleClose} 
                variant="outlined" 
                autoFocus
                style={{ margin: "0 16px" }} 
              >
                {formatMessage(intl, "deduplication", "deduplicate.button.cancel")}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DeduplicationFieldSelectionDialog))));
